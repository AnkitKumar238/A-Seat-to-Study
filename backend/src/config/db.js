/**
 * Database connection handler.
 *
 * NOTE: MongoDB connection is temporarily disabled for Vercel deployment
 * as per architecture decision. Supabase will be integrated in a later phase.
 * No connection attempts to localhost or Atlas will be made.
 */
export const connectDB = async () => {
  // Intentionally disabled — do not attempt MongoDB connection
  console.log('ℹ️  Database connection is disabled. Running with in-memory data store.');
};

