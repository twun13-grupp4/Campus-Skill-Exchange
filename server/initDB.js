require('dotenv/config') //läser in mongodb_uri från .env
const mongoose = require('mongoose')
const connectDB = require('./config/db') // Albins anslutningsfunktion
const School = require('./models/School')
const Program = require('./models/Program')
const Course = require('./models/Course')
const User = require('./models/User')
const Question = require('./models/Question')
const Answer = require('./models/Answer')
const Notification = require('./models/Notification')

// ett datum några dagar bakåt, så frågorna inte får exakt samma tid
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)

/**
 * Fyller databasen med testdata
 * OBS: tömmer schools, programs, courses, users, questions, answers och notifications först
 * körs med: npm run initdb -- --yes
 */
const initDB = async () => {
  // skyddar den delade databasen mot att tömmas av misstag
  if (!process.argv.includes('--yes')) {
    console.log(
      'initDB clears ALL schools, programs, courses, users, questions, answers and notifications in the shared database.',
    )
    console.log('Run it with: npm run initdb -- --yes')
    return
  }

  await connectDB() //anslut till database

  // töm allt så vi börjar från noll
  await Notification.deleteMany()
  await Answer.deleteMany()
  await Question.deleteMany()
  await User.deleteMany()
  await Course.deleteMany()
  await Program.deleteMany()
  await School.deleteMany()

  // ta bort index som inte längre finns i modellerna och skapa de nya
  // (t.ex. program: unikt namn i stället för unikt per skola)
  await Question.syncIndexes()
  await Program.syncIndexes()

  // skapa skolor
  const [lu, kth, chalmers, ju] = await School.create([
    { name: 'Lunds universitet' },
    { name: 'KTH' },
    { name: 'Chalmers' },
    { name: 'JU' },
  ])

  // skapa program, ett program delas av alla skolor som erbjuder det
  const [itek, tekMat, data, maskin, hingData] = await Program.create([
    {
      name: 'Civilingenjör i informations- och kommunikationsteknik',
      schools: [lu._id],
    },
    {
      name: 'Civilingenjör i teknisk matematik',
      schools: [lu._id, chalmers._id],
    },
    {
      name: 'Civilingenjör i datateknik',
      schools: [kth._id, chalmers._id],
    },
    {
      name: 'Civilingenjör i maskinteknik',
      schools: [kth._id, chalmers._id],
    },
    {
      name: 'Högskoleingenjör i datateknik',
      schools: [ju._id],
    },
  ])

  // skapa kurser, en kurs hör till en skola
  // programs = programmen kursen ingår i (en kurs kan ingå i flera)
  const [webbutv, diskret, envarre, linalg, algo, , oop, mekanik, , pwa] =
    await Course.create([
      { name: 'Webbutveckling', school: lu._id, programs: [itek._id] },
      { name: 'Diskret matematik', school: lu._id, programs: [itek._id] },
      { name: 'Envariabelanalys', school: lu._id, programs: [tekMat._id] },
      {
        name: 'Linjär algebra',
        school: lu._id,
        programs: [itek._id, tekMat._id],
      },
      {
        name: 'Algoritmer och datastrukturer',
        school: kth._id,
        programs: [data._id],
      },
      { name: 'Hållfasthetslära', school: kth._id, programs: [maskin._id] },
      {
        name: 'Objektorienterad programmering',
        school: chalmers._id,
        programs: [data._id],
      },
      { name: 'Mekanik', school: chalmers._id, programs: [maskin._id] },
      {
        name: 'Flervariabelanalys',
        school: chalmers._id,
        programs: [tekMat._id],
      },
      {
        name: 'Programming Web Applications',
        school: ju._id,
        programs: [hingData._id],
      },
    ])

  // skapa användare, programmet måste erbjudas på användarens skola
  const [anna, erik, sara, omar, lina] = await User.create([
    {
      name: 'Anna',
      email: 'anna@test.se',
      password: 'password123',
      school: lu._id,
      program: tekMat._id,
    },
    {
      name: 'Erik',
      email: 'erik@test.se',
      password: 'password123',
      school: lu._id,
      program: itek._id,
    },
    {
      name: 'Sara',
      email: 'sara@test.se',
      password: 'password123',
      school: kth._id,
      program: data._id,
      role: 'teacher',
    },
    {
      name: 'Omar',
      email: 'omar@test.se',
      password: 'password123',
      school: chalmers._id,
      program: data._id,
    },
    {
      name: 'Lina',
      email: 'lina@test.se',
      password: 'password123',
      school: ju._id,
      program: hingData._id,
    },
    {
      // moderator kan ta bort alla frågor och svar
      name: 'Moa',
      email: 'moa@test.se',
      password: 'password123',
      school: ju._id,
      program: hingData._id,
      role: 'moderator',
    },
  ])

  // skapa frågor, author = id:t från användarna ovan
  // school kopieras från kursen, precis som questionService gör
  const [, q2, , q4, , q6] = await Question.create([
    {
      title: 'Kan du differentialekvationer?',
      description:
        'Jag fastnar på separabla ekvationer, någon som kan förklara steg för steg?',
      course: envarre._id,
      school: envarre.school,
      author: anna._id,
      createdAt: daysAgo(9),
    },
    {
      title: 'Hur fungerar useEffect i React?',
      description: 'Förstår inte när den körs och vad dependency-arrayen gör.',
      course: webbutv._id,
      school: webbutv.school,
      author: erik._id,
      status: 'answered',
      createdAt: daysAgo(7),
    },
    {
      title: 'Tips inför tentan i algoritmer?',
      description: 'Vilka kapitel är viktigast att plugga på?',
      course: algo._id,
      school: algo.school,
      author: sara._id,
      createdAt: daysAgo(6),
    },
    {
      title: 'Vad är skillnaden mellan arv och interface i Java?',
      description:
        'När ska man använda en abstrakt klass och när räcker det med ett interface?',
      course: oop._id,
      school: oop.school,
      author: omar._id,
      status: 'answered',
      createdAt: daysAgo(5),
    },
    {
      title: 'Hur fungerar Gausselimination?',
      description:
        'Jag får olika svar varje gång jag radreducerar, finns det en metod att följa?',
      course: linalg._id,
      school: linalg.school,
      author: erik._id,
      createdAt: daysAgo(4),
    },
    {
      title: 'Vad är skillnaden mellan PUT och PATCH?',
      description:
        'Båda verkar uppdatera en resurs i ett REST API, när använder man vilken?',
      course: pwa._id,
      school: pwa.school,
      author: lina._id,
      status: 'answered',
      createdAt: daysAgo(3),
    },
    {
      title: 'Hur gör man ett induktionsbevis?',
      description:
        'Jag förstår basfallet men fastnar alltid på induktionssteget.',
      course: diskret._id,
      school: diskret.school,
      author: erik._id,
      createdAt: daysAgo(2),
    },
    {
      title: 'Hur räknar man ut tröghetsmoment?',
      description:
        'Finns det något knep för att välja rätt axel när man använder Steiners sats?',
      course: mekanik._id,
      school: mekanik.school,
      author: omar._id,
      createdAt: daysAgo(1),
    },
  ])

  // skapa svar, question = id:t från frågorna ovan
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
    {
      question: q4._id,
      description:
        'Ett interface beskriver bara vad en klass kan göra, arv delar även på färdig kod. En klass kan ha flera interface men bara en superklass.',
      author: sara._id,
      upvotes: 2,
    },
    {
      question: q6._id,
      description:
        'PUT ersätter hela resursen, PATCH ändrar bara de fält du skickar med.',
      author: erik._id,
      upvotes: 4,
    },
  ])

  console.log(
    'Database initialised: 4 schools, 5 programs, 10 courses, 5 users, 8 questions, 4 answers',
  )
}

initDB()
  .catch((error) => {
    console.error('initDB failed', error.message)
    process.exitCode = 1 // talar om att skriptet misslyckats
  })
  .finally(() => mongoose.connection.close()) // stäng anslutningen så skriptet avslutas
