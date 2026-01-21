import mongoose from 'mongoose';

// Workaround for Node.js OpenSSL TLS issues with MongoDB Atlas on Windows
// This is needed when using newer Node.js versions with certain OpenSSL builds
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Runtime Guard: Local development must NOT use SRV records due to DNS instability
if (process.env.NODE_ENV !== 'production' && MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error(
    '❌ MongoDB SRV Connection Error (Local Development)\n' +
    '   You are using "mongodb+srv://" in a local environment. This causes intermittent DNS/TLS failures on Windows.\n' +
    '   Please use a direct connection string ("mongodb://") in your .env.local file.\n' +
    '   See README.md for configuration details.'
  );
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
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

export default connectDB;
