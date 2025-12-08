import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, dist/index.js is in the same folder as dist/public
  // So we need to go from dist/ to dist/public
  const distPath = path.resolve(__dirname, "public");
  
  // Fallback: try the old path structure
  const altDistPath = path.resolve(__dirname, "..", "dist", "public");

  log(`Primary static path: ${distPath}`);
  log(`Alternative static path: ${altDistPath}`);
  log(`Current __dirname: ${__dirname}`);
  log(`Process cwd: ${process.cwd()}`);

  let staticPath = distPath;
  
  if (!fs.existsSync(distPath)) {
    log(`Primary path not found, trying alternative...`);
    if (fs.existsSync(altDistPath)) {
      staticPath = altDistPath;
      log(`Using alternative path: ${staticPath}`);
    } else {
      // Try process.cwd() based path
      const cwdPath = path.resolve(process.cwd(), "dist", "public");
      log(`Trying cwd-based path: ${cwdPath}`);
      if (fs.existsSync(cwdPath)) {
        staticPath = cwdPath;
        log(`Using cwd-based path: ${staticPath}`);
      } else {
        const errorMsg = `Could not find the build directory in any location`;
        log(`ERROR: ${errorMsg}`);
        
        // List what we can find
        try {
          const distContents = fs.readdirSync(path.resolve(process.cwd(), "dist"));
          log(`Contents of dist/: ${distContents.join(", ")}`);
        } catch (e) {
          log(`Cannot read dist/: ${e}`);
        }
        
        app.use("*", (_req, res) => {
          res.status(500).send(`
            <html>
              <head><title>Build Error</title></head>
              <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1>Build Directory Not Found</h1>
                <p>Tried paths:</p>
                <ul style="list-style: none;">
                  <li>${distPath}</li>
                  <li>${altDistPath}</li>
                  <li>${path.resolve(process.cwd(), "dist", "public")}</li>
                </ul>
                <p>Please ensure the build completed successfully.</p>
              </body>
            </html>
          `);
        });
        return;
      }
    }
  }

  log(`✓ Using static files directory: ${staticPath}`);
  
  // List contents for debugging
  try {
    const contents = fs.readdirSync(staticPath);
    log(`Static directory contents: ${contents.join(", ")}`);
  } catch (e) {
    log(`Cannot list static directory: ${e}`);
  }
  
  // Serve static files, but exclude /health and /api routes
  app.use((req, res, next) => {
    if (req.path === "/health" || req.path.startsWith("/api")) {
      return next();
    }
    express.static(staticPath)(req, res, next);
  });

  // fall through to index.html if the file doesn't exist (but not for /health or /api)
  app.use("*", (req, res, next) => {
    // Skip /health and /api routes
    if (req.path === "/health" || req.path.startsWith("/api")) {
      return next();
    }
    const indexPath = path.resolve(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath, (err) => {
        if (err) {
          log(`Error sending index.html: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).send("Error loading page");
          }
        }
      });
    } else {
      log(`index.html not found at: ${indexPath}`);
      res.status(404).send("Page not found");
    }
  });
}
