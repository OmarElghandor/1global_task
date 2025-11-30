// src/app/app.ts
import express from "express";
import { env } from "../config/env.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  // basic middlewares
  app.use(express.json());

  // Handle JSON parsing errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ 
        error: "Invalid JSON", 
        message: err.message 
      });
    }
    next(err);
  });

  // simple request logging
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // health check
  app.get("/ping", (_req, res) => {
    res.json({ ok: true, env: env.nodeEnv });
  });

  // main router
  app.use("/api", router);

  // error handler (should be last)
  app.use(errorHandler);

  return app;
}
