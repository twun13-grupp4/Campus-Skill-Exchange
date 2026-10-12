require('dotenv/config') //läser in mongodb_uri från .env
const mongoose = require('mongoose')
const connectDB = require('./config/db') // Albins anslutningsfunktion
const User = require('./models/User')
const Question = require('./models/Question')
const Answer = require('./models/Answer')

/**
 * Fyller databasen med testdata
 * OBS: tömmer users, questions och answers först
 * körs med :npm run initdb
 */
const initDB = async () => {
    await connectDB() //anslut till database


// tom allt så vi börjar frpn noll
await Answer.deleteMany()
await Question.deleteMany()
await User.deleteMany()

//skapa användere
const [anna, erik, sara] = await User.create([
    { name: 'Anna', email: 'anna@test.se', password: 'password123', school: 'Lunds universitet', program: 'Civilingenjör i teknisk matematik' },
    { name: 'Erik', email: 'erik@test.se', password: 'password123', school: 'Lunds universitet', program: 'Civilingenjör i informations- och kommunikationsteknik' },
    { name: 'Sara', email: 'sara@test.se', password: 'password123', school: 'KTH', program: 'Civilingenjör i datateknik', role: 'teacher' },
])

//skapa frpgor, author = id:t från användere ovan 
const [q1, q2] = await Question.create([
    { title: 'Kan du differentialekvationer?', description: 'Jag fastnar på separabla ekvationer, någon som kan förklara steg för steg?', courseTag: 'Envariabelanalys', school: 'Lunds universitet', author: anna._id },
    { title: 'Hur fungerar useEffect i React?', description: 'Förstår inte när den körs och vad dependency-arrayen gör.', courseTag: 'Webbutveckling', school: 'Lunds universitet', author: erik._id, status: 'answered' },
    { title: 'Tips inför tentan i algoritmer?', description: 'Vilka kapitel är viktigast att plugga på?', courseTag: 'Algoritmer och datastrukturer', school: 'KTH', author: sara._id },
])

//skapa svar, question = id:t
await Answer.create([
    { question: q2._id, description: 'useEffect körs efter varje render, om inte dependency-arrayen säger annat.', author: sara._id, upvotes: 3 },
    { question: q2._id, description: 'Tom array [] betyder att den bara körs en gång när komponenten laddas.', author: anna._id, upvotes: 1 },
])

console.log(`Database initialise 3 users, 3 questions, 2 answers (${q1.title}...)`)
}

initDB()
    .catch((error) => {
        console.error('initDB failed', error.message)
        process.exitCode = 1 // talar om att skriptet misslyckats 
    })
    .finally(() => mongoose.connection.close()) //ständ anslutninge så skriptet avslutas 