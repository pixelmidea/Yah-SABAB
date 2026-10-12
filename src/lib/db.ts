import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bd_ecommerce';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000 // 10 seconds timeout for Atlas cloud connections
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('Successfully connected to MongoDB database:', mongooseInstance.connection.name || 'default');
        return mongooseInstance;
      })
      .catch(async (err) => {
        console.warn('MongoDB Atlas/Remote connection failed:', err.message);
        console.warn('Falling back to MongoMemoryServer for development...');
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          const memMongoose = await mongoose.connect(uri);
          console.log('Connected to MongoMemoryServer temporary instance.');
          return memMongoose;
        } catch (fallbackErr) {
          console.error('MongoMemoryServer fallback failed:', fallbackErr);
          throw err;
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
