import "dotenv/config";
import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const app = express();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
  statement_timeout: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Only parse JSON for POST/PUT requests
app.use(express.json());

// Test database connection on startup
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});


// Request logging middleware - MUST be first
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.get("/", (req: Request, res: Response) => {
  console.log("Root endpoint hit");
  res.json({ message: "API is running ✅" });
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    console.log("Fetching users...");
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (err: any) {
    console.error("Database error:", err);
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      res.status(503).json({ error: "Database connection failed. Please check if PostgreSQL is running." });
    } else {
      res.status(500).json({ error: "Something went wrong", details: err.message });
    }
  }
});


const PORT = 3000;

// Test database connection before starting server
async function testConnection() {
  try {
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
  } catch (err: any) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please ensure PostgreSQL is running and DATABASE_URL is correct');
    process.exit(1);
  }
}

// Start server after connection test
testConnection().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Server accessible on http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
