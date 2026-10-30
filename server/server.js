/**
 * Entry point for the Express server.
 * Mounts the API routes under /api, serves the built client (client/dist) with
 * a fallback to index.html for deep links, and starts listening once MongoDB is connected.
 */
require('dotenv/config') // läser in variablerna från .env till process.env
const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express() //starta serverappen
app.use(cors())
app.use(express.json()) // appen tolkar JSON

const questionsRoutes = require('./routes/questionRoutes') //hämtar routerfilen
app.use('/api/questions', questionsRoutes) //(path, funktion) för test curl http://localhost:3000/api/questions

const userRoutes = require('./routes/userRoutes') //routerfil för användare
app.use('/api/users', userRoutes) //börjar med /api/users

const schoolRoutes = require('./routes/schoolRoutes') //skolor
app.use('/api/schools', schoolRoutes)

const programRoutes = require('./routes/programRoutes') //program, kan filtreras på skola
app.use('/api/programs', programRoutes)

const courseRoutes = require('./routes/courseRoutes') //kurser, kan filtreras på skola
app.use('/api/courses', courseRoutes)

const notificationRoutes = require('./routes/notificationRoutes') //notiser, kräver inloggning
app.use('/api/notifications', notificationRoutes)
const answerRoutes = require('./routes/answerRoutes') //svar, bara DELETE just nu
app.use('/api/answers', answerRoutes)

// okända /api-anrop ska ge JSON 404, inte index.html
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }))

// serverar den byggda klienten om den finns (efter npm run build)
const clientDist = path.join(__dirname, '../client/dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  // alla andra GET ger index.html så React Router hanterar refresh/deep links
  app.get('/{*splat}', (req, res) =>
    res.sendFile(path.join(clientDist, 'index.html')),
  )
}

const PORT = process.env.PORT || 3000 //http://localhost:3000

// starta servern först när databasen är ansluten
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} `))
})
