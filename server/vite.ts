import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

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
        import.meta.dirname,
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
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  log(`Looking for static files in: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    const errorMsg = `Could not find the build directory: ${distPath}, make sure to build the client first`;
    log(`ERROR: ${errorMsg}`);
    log(`Current working directory: ${process.cwd()}`);
    log(`__dirname equivalent: ${import.meta.dirname}`);
    
    // Instead of throwing, serve an error page
    app.use("*", (_req, res) => {
      res.status(500).send(`
        <html>
          <head><title>Build Error</title></head>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1>Build Directory Not Found</h1>
            <p>Expected path: ${distPath}</p>
            <p>Please ensure the build completed successfully.</p>
            <p>Check the deployment logs for build errors.</p>
          </body>
        </html>
      `);
    });
    return;
  }

  log(`✓ Found static files directory: ${distPath}`);
  
  // Serve static files, but exclude /health and /api routes
  app.use((req, res, next) => {
    if (req.path === "/health" || req.path.startsWith("/api")) {
      return next();
    }
    express.static(distPath)(req, res, next);
  });

  // fall through to index.html if the file doesn't exist (but not for /health or /api)
  app.use("*", (req, res, next) => {
    // Skip /health and /api routes
    if (req.path === "/health" || req.path.startsWith("/api")) {
      return next();
    }
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath, (err) => {
        if (err) {
          log(`Error sending index.html: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).send(`
              <html>
                <head><title>Server Error</title></head>
                <body style="font-family: sans-serif; padding: 40px; text-align: center;">
                  <h1>500 - Server Error</h1>
                  <p>Error loading index.html: ${err.message}</p>
                </body>
              </html>
            `);
          }
        }
      });
    } else {
      log(`index.html not found at: ${indexPath}`);
      res.status(404).send(`
        <html>
          <head><title>Not Found</title></head>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1>404 - File Not Found</h1>
            <p>index.html not found at: ${indexPath}</p>
          </body>
        </html>
      `);
    }
  });
}
