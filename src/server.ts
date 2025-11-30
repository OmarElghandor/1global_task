import { createApp } from "./app/app.js";
import { env } from "./config/env.js";
import { pool, prisma, shutdownDb } from "./db/prisma.js";

async function testConnection() {
  console.log("Testing database connection...");
  await pool.query("SELECT NOW()");
  console.log("✅ Database connection successful");
}

async function start() {
  try {
    await testConnection();

    const app = createApp();

    const server = app.listen(env.port, "0.0.0.0", () => {
      console.log(`Server listening on http://localhost:${env.port}`);
      console.log(`Server accessible on http://0.0.0.0:${env.port}`);
    });

    const shutdown = async () => {
      console.log("Shutting down gracefully...");
      server.close(async () => {
        await shutdownDb();
        console.log("Shutdown complete.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

start();
