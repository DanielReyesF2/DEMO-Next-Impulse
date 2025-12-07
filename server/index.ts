import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Health check endpoint - MUST be first, before any middleware
app.get("/health", (_req, res) => {
  try {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(500).json({ 
      status: "error", 
      message: e instanceof Error ? e.message : String(e)
    });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  try {
    const start = Date.now();
    const path = req.path;

    // Log all incoming requests
    log(`${req.method} ${path}`);

    res.on("finish", () => {
      try {
        const duration = Date.now() - start;
        log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
      } catch (e) {
        // Ignore logging errors
      }
    });

    next();
  } catch (e) {
    log(`Error in request middleware: ${e}`);
    next(e);
  }
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
      log(`✓ Health check available at: http://0.0.0.0:${port}/health`);
    });

    // Verify server is actually listening
    server.on('listening', () => {
      const address = server.address();
      log(`✓ Server confirmed listening on ${address ? JSON.stringify(address) : 'unknown'}`);
    });

    server.on('close', () => {
      log(`⚠ Server closed`);
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
