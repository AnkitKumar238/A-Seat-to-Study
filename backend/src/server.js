import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
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
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to Database (Non-blocking)
connectDB();

// Core Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to A Seat to Study API',
    documentation: '/api/health',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start HTTP Server when executed directly (not when imported in test runners)
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].includes('nodemon'));

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`🚀 A Seat to Study Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;
