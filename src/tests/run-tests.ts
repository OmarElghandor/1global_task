// Simple test runner
import { runDeviceTests } from "./device.test.js";
import { createApp } from "../app/app.js";
import { env } from "../config/env.js";
import http from "http";

let server: http.Server;

async function startTestServer() {
  const app = createApp();
  
  return new Promise<void>((resolve) => {
    server = app.listen(env.port, async () => {
      console.log(`Test server started on port ${env.port}\n`);
      // Wait a bit for server to be ready
      await new Promise(r => setTimeout(r, 100));
      resolve();
    });
  });
}

async function stopTestServer() {
  return new Promise<void>((resolve) => {
    if (server) {
      server.close(() => {
        console.log("\nTest server stopped");
        resolve();
      });
    } else {
      resolve();
    }
  });
}

async function main() {
  try {
    await startTestServer();
    await runDeviceTests();
  } catch (error) {
    console.error("Test runner error:", error);
    process.exit(1);
  } finally {
    await stopTestServer();
    process.exit(0);
  }
}

main();

