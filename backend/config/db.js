import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

global.isMockDB = true;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: MONGO_URI env variable is missing.');
    console.log('\x1b[32m%s\x1b[0m', 'ℹ️ Falling back to Local File-Based JSON Mock Database (.db/*.json).');
    global.isMockDB = true;
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB database connected successfully.');
    global.isMockDB = false;
  } catch (error) {
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️ MongoDB DNS resolution failed. Retrying with fallback DNS (8.8.8.8)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(mongoUri);
        console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB database connected successfully using fallback DNS.');
        global.isMockDB = false;
        return;
      } catch (retryError) {
        console.error('\x1b[31m%s\x1b[0m', `❌ MongoDB connection failed after DNS fallback: ${retryError.message}`);
      }
    } else {
      console.error('\x1b[31m%s\x1b[0m', `❌ MongoDB connection failed: ${error.message}`);
    }

    console.log('\x1b[32m%s\x1b[0m', 'ℹ️ Falling back to Local File-Based JSON Mock Database (.db/*.json).');
    global.isMockDB = true;
  }
};

// Model retriever
export const getModel = (mongooseModel, mockCollection) => {
  return global.isMockDB ? mockCollection : mongooseModel;
};
