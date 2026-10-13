import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI?.trim()

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable')
}

const cached = globalThis.__mongoose || (globalThis.__mongoose = { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
