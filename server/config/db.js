const mongoose = require('mongoose')

// ansluter till MongoDB med adressen i MONGODB_URI (från server/.env)
const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI saknas. Lägg .env-filen från teamet i server/.')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log(`MongoDB connected: ${mongoose.connection.name}`)
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
