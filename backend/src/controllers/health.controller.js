import { supabase, isSupabaseConfigured } from '../config/supabase.js';

/**
 * Health check controller.
 * Returns API operational status, environment, and Supabase database state.
 */
export const getHealthStatus = async (req, res) => {
  let dbStatus = 'configured';
  let dbMessage = 'Supabase client initialized with cloud PostgreSQL.';

  if (!isSupabaseConfigured) {
    dbStatus = 'not_configured';
    dbMessage = 'Supabase credentials missing. Running on memory fallback.';
  }

  res.status(200).json({
    success: true,
    service: 'A Seat to Study API',
    status: 'operational',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'supabase_postgresql',
      configured: isSupabaseConfigured,
      status: dbStatus,
      message: dbMessage,
    },
  });
};

export default { getHealthStatus };
