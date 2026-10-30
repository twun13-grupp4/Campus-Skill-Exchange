/**
 * Runs before every test file (setupFilesAfterEnv in package.json).
 * Starts an in-memory MongoDB so tests never touch the shared Atlas database,
 * and empties all collections before each test.
 */
const os = require('os')
const mongoose = require('mongoose')
// -core = utan postinstall, så MongoDB laddas bara ner när testerna körs, inte vid npm install
const { MongoMemoryServer } = require('mongodb-memory-server-core')

process.env.JWT_SECRET = 'test-secret'

// laddar app.js så alla modeller registreras innan index skapas
require('../app')

let mongo

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  // drivern laddar 'os' med import(), vilket Jest inte tillåter, så vi skickar in den
  await mongoose.connect(mongo.getUri(), { runtimeAdapters: { os } })
  // unika index (t.ex. email) måste finnas innan testerna körs
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()))
}, 120000) // första körningen laddar ner MongoDB

beforeEach(async () => {
  const collections = Object.values(mongoose.connection.collections)
  await Promise.all(collections.map((c) => c.deleteMany({})))
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongo.stop()
})
