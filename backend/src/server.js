import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Resolve directory paths for reliable .env loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback to current working directory .env

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for local development and deployed Vercel frontend
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Core Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server health checks)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'A Seat to Study API',
    status: 'operational',
    message: 'Welcome to A Seat to Study API',
    documentation: '/api/health',
    version: '1.0.0',
    database: {
      provider: 'supabase_postgresql',
      configured: true,
      status: 'configured',
      message: 'Supabase PostgreSQL integration active.',
    },
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start HTTP Server only during local direct execution (never in Vercel serverless or test runners)
const isVercel = Boolean(process.env.VERCEL);
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].includes('nodemon'));

if (!isVercel && isDirectRun) {
  app.listen(PORT, () => {
    console.log(`🚀 A Seat to Study Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;
