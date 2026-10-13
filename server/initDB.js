require('dotenv/config') //läser in mongodb_uri från .env
const mongoose = require('mongoose')
const connectDB = require('./config/db') // Albins anslutningsfunktion
const School = require('./models/School')
const Program = require('./models/Program')
const Course = require('./models/Course')
const User = require('./models/User')
const Question = require('./models/Question')
const Answer = require('./models/Answer')

/**
 * Fyller databasen med testdata
 * OBS: tömmer schools, programs, courses, users, questions och answers först
 * körs med: npm run initdb -- --yes
 */
const initDB = async () => {
  // skyddar den delade databasen mot att tömmas av misstag
  if (!process.argv.includes('--yes')) {
    console.log(
      'initDB clears ALL schools, programs, courses, users, questions and answers in the shared database.',
    )
    console.log('Run it with: npm run initdb -- --yes')
    return
  }

  await connectDB() //anslut till database

  // töm allt så vi börjar från noll
  await Answer.deleteMany()
  await Question.deleteMany()
  await User.deleteMany()
  await Course.deleteMany()
  await Program.deleteMany()
  await School.deleteMany()

  // ta bort gamla index (t.ex. courseTag) och skapa nya, som textindexet för sök
  await Question.syncIndexes()

  // skapa skolor
  const [lu, kth, chalmers] = await School.create([
    { name: 'Lunds universitet' },
    { name: 'KTH' },
    { name: 'Chalmers' },
  ])

  // skapa program, school = id:t från skolorna ovan
  const [luItek, luTekMat, kthData, chMaskin] = await Program.create([
    {
      name: 'Civilingenjör i informations- och kommunikationsteknik',
      school: lu._id,
    },
    { name: 'Civilingenjör i teknisk matematik', school: lu._id },
    { name: 'Civilingenjör i datateknik', school: kth._id },
    { name: 'Civilingenjör i maskinteknik', school: chalmers._id },
  ])

  // skapa kurser, school = id:t från skolorna ovan
  // programs = programmen kursen ingår i (en kurs kan ingå i flera)
  const [webbutv, , envarre, , algo] = await Course.create([
    {
      name: 'Webbutveckling',
      school: lu._id,
      programs: [luItek._id],
    },
    {
      name: 'Diskret matematik',
      school: lu._id,
      programs: [luItek._id],
    },
    {
      name: 'Envariabelanalys',
      school: lu._id,
      programs: [luTekMat._id],
    },
    {
      name: 'Linjär algebra',
      school: lu._id,
      programs: [luItek._id, luTekMat._id],
    },
    {
      name: 'Algoritmer och datastrukturer',
      school: kth._id,
      programs: [kthData._id],
    },
    {
      name: 'Mekanik',
      school: chalmers._id,
      programs: [chMaskin._id],
    },
  ])

  // skapa användare, school och program = id:n från ovan
  const [anna, erik, sara] = await User.create([
    {
      name: 'Anna',
      email: 'anna@test.se',
      password: 'password123',
      school: lu._id,
      program: luTekMat._id,
    },
    {
      name: 'Erik',
      email: 'erik@test.se',
      password: 'password123',
      school: lu._id,
      program: luItek._id,
    },
    {
      name: 'Sara',
      email: 'sara@test.se',
      password: 'password123',
      school: kth._id,
      program: kthData._id,
      role: 'teacher',
    },
  ])

  // skapa frågor, author = id:t från användarna ovan
  // school kopieras från kursen, precis som questionService gör
  const [, q2] = await Question.create([
    {
      title: 'Kan du differentialekvationer?',
      description:
        'Jag fastnar på separabla ekvationer, någon som kan förklara steg för steg?',
      course: envarre._id,
      school: envarre.school,
      author: anna._id,
    },
    {
      title: 'Hur fungerar useEffect i React?',
      description: 'Förstår inte när den körs och vad dependency-arrayen gör.',
      course: webbutv._id,
      school: webbutv.school,
      author: erik._id,
      status: 'answered',
    },
    {
      title: 'Tips inför tentan i algoritmer?',
      description: 'Vilka kapitel är viktigast att plugga på?',
      course: algo._id,
      school: algo.school,
      author: sara._id,
    },
  ])

  // skapa svar, question = id:t
  await Answer.create([
    {
      question: q2._id,
      description:
        'useEffect körs efter varje render, om inte dependency-arrayen säger annat.',
      author: sara._id,
      upvotes: 3,
    },
    {
      question: q2._id,
      description:
        'Tom array [] betyder att den bara körs en gång när komponenten laddas.',
      author: anna._id,
      upvotes: 1,
    },
  ])

  console.log(
    'Database initialised: 3 schools, 4 programs, 6 courses, 3 users, 3 questions, 2 answers',
  )
}

initDB()
  .catch((error) => {
    console.error('initDB failed', error.message)
    process.exitCode = 1 // talar om att skriptet misslyckats
  })
  .finally(() => mongoose.connection.close()) // stäng anslutningen så skriptet avslutas
