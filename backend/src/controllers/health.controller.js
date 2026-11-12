import mongoose from 'mongoose';

/**
 * Health check controller.
 * Returns API operational status, environment, and database state.
 */
export const getHealthStatus = (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    service: 'A Seat to Study API',
    status: 'operational',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbStatus] || 'unknown',
    },
  });
};

