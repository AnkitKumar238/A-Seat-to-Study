import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB Atlas / Local MongoDB instance.
 * Gracefully handles connection failures without abruptly terminating the server.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Database features will be disabled.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('ℹ️  Ensure your MongoDB Atlas connection string is configured in backend/.env');
  }
};

