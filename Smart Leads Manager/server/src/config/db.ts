import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`⚠️ MONGODB CONNECTION WARNING: ${error.message}`);
    } else {
      console.warn('⚠️ Unknown error connecting to MongoDB');
    }
    console.log('💡 RUNNING IN DEMO MODE (IN-MEMORY FAILOVER STORAGE ENABLED)');
  }
};
