import mongoose from 'mongoose';

const globalForMongoose = globalThis as unknown as { _mongoose?: Promise<typeof mongoose> };

export function connectDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set.');
  if (!globalForMongoose._mongoose) {
    globalForMongoose._mongoose = mongoose
      .connect(uri, { dbName: process.env.MONGODB_DB || 'backroom_store', serverSelectionTimeoutMS: 8000 })
      .catch((err) => {
        globalForMongoose._mongoose = undefined;
        throw err;
      });
  }
  return globalForMongoose._mongoose;
}
