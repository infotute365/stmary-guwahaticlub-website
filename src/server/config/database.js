import mongoose from 'mongoose'

// Shared across App Router bundles and development hot reloads.
export default async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim()
  if (!uri) throw new Error('MONGODB_URI is not configured')
  const cache = globalThis.__guwahatiClubMongo || (globalThis.__guwahatiClubMongo = { pending: null, client: null })
  if (mongoose.connection.readyState === 1) {
    cache.client = mongoose.connection.getClient()
    return mongoose
  }
  if (!cache.pending) {
    cache.pending = (async () => {
      // The driver owns reconnection of an established client. Do not create a
      // second pool when a network interruption temporarily marks it disconnected.
      if (mongoose.connection.readyState === 3) throw new Error('Database is closing')
      if (mongoose.connection.readyState === 2) {
        await mongoose.connection.asPromise()
        cache.client = mongoose.connection.getClient()
        return mongoose
      }
      if (cache.client && cache.client === mongoose.connection.getClient() && cache.client.topology) {
        await mongoose.connection.db.admin().ping()
        return mongoose
      }
      try {
        const connection = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          socketTimeoutMS: 15000,
          maxPoolSize: 10,
          bufferCommands: false,
        })
        cache.client = mongoose.connection.getClient()
        return connection
      } catch (error) {
        // Failed initial clients can retain a topology and a rejected initial
        // promise. They must not be confused with a live reconnecting client.
        cache.client = null
        await mongoose.disconnect().catch(() => {})
        throw error
      }
    })().finally(() => { cache.pending = null })
  }
  return cache.pending
}
