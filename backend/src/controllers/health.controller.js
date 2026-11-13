/**
 * Health check controller.
 * Returns API operational status, environment, and database state.
 * Works independently of any database connection.
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    service: 'A Seat to Study API',
    status: 'operational',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      configured: false,
      status: 'not_configured',
      message: 'Database is not configured yet (Supabase integration pending). Running with in-memory data store.',
    },
  });
};

