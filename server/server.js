require('dotenv/config') // läser in variablerna från .env till process.env
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

const answerRoutes = require('./routes/answerRoutes') //svar, bara DELETE just nu
app.use('/api/answers', answerRoutes)

const PORT = process.env.PORT || 3000 //http://localhost:3000

// starta servern först när databasen är ansluten
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} `))
})
