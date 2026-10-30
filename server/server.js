/**
 * Entry point for the server: connects to MongoDB, then starts the
 * Express app (built in app.js) on PORT.
 */
require('dotenv/config') // läser in variablerna från .env till process.env
const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 3000 //http://localhost:3000

// starta servern först när databasen är ansluten
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} `))
})
