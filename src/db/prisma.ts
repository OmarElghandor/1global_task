// src/db/prisma.ts
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";

export const pool = new Pool({
  connectionString: env.dbUrl,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
  statement_timeout: 10000,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

// Helpful shutdown helper
export async function shutdownDb() {
  await prisma.$disconnect();
  await pool.end();
}
