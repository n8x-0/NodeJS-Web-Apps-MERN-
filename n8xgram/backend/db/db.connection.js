const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable in .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

module.exports.dbconnect = async () => {
  if (cached.conn) {
    console.log('✅ Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 Creating new database connection...');
    cached.promise = mongoose.connect(DATABASE_URL).then((mongoose) => {
      console.log('✅ Database connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ Database connection failed:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('❌ Failed to establish connection from promise:', error);
    throw error;
  }

  return cached.conn;
}