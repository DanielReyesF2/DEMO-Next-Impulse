import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log all incoming requests
  log(`${req.method} ${path}`);

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    } else {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  try {
    log("Starting server initialization...");
    const server = await registerRoutes(app);
    log("Routes registered successfully");

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      log("Setting up Vite for development...");
      await setupVite(app, server);
    } else {
      log("Setting up static file serving for production...");
      serveStatic(app);
    }

    // Error handler must be after all routes
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${message} (${status})`);
      console.error("Express error:", err);
      
      // Don't throw, just respond
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    });

    // Serve the app on the port specified by PORT env variable, or default to 3000
    // this serves both the API and the client.
    const port = Number(process.env.PORT) || 3000;
    
    server.on('error', (error: any) => {
      log(`Server error: ${error.message}`);
      console.error("Server error:", error);
    });

    server.listen(port, "0.0.0.0", () => {
      log(`✓ Server listening on port ${port}`);
      log(`✓ Environment: ${app.get("env")}`);
      log(`✓ Ready to accept connections`);
    });

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      log(`Uncaught Exception: ${error.message}`);
      console.error(error);
      // Don't exit, keep server running
    });

    process.on('unhandledRejection', (reason, promise) => {
      log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
      console.error(reason);
      // Don't exit, keep server running
    });

  } catch (error) {
    log(`Failed to start server: ${error}`);
    console.error(error);
    process.exit(1);
  }
})();
