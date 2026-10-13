const mongoose = require('mongoose')
const Answer = require('../models/Answer')
const Question = require('../models/Question')
require('../models/User') //laddar user modellen

/**
 * Gor om populerad referens till {_id,name}
 * Om användaren har raderats är doc null, då returnerad null istället för crash
 */
const toRef = (doc) => (doc ? { _id: doc._id, name: doc.name } : null)

/**
 * Bestämmer exakt vilka fält klienterna får se för svar
 * T.ex skickas inte upvotedBy ut tilla alla
 * author måste vara populerad innan
 */
const toPublicAnswer = (answer) => ({
  _id: answer._id,
  question: answer.question,
  description: answer.description,
  upvotes: answer.upvotes,
  author: toRef(answer.author),
  createdAt: answer.createdAt,
  updatedAt: answer.updatedAt,
})

/**
 * Alla svar till en fråga, flest upvoted först, sen äldst
 * Returnerar null om frågans id har fel format -> 404
 */
const listAnswers = async (questionId) => {
  if (!mongoose.isValidObjectId(questionId)) return null

  const answers = await Answer.find({ question: questionId }) //bara svaren som hör till frågan
    .sort({ upvotes: -1, createdAt: 1 }) //-1 störst först, 1 = äldst först
    .populate('author', 'name') // bter author id mot {_id,name}
    .lean() //iställer för mongoose dokument -> snabbare
  return answers.map(toPublicAnswer)
}

/**
 * skapar ett svar acv den inloggade användaren
 * Returnear null om frågan inte finns -> 404
 */
const createAnswer = async (questionId, description, user) => {
  if (!mongoose.isValidObjectId(questionId)) return null

  //kolla om frågan finns
  const exist = await Question.exists({ _id: questionId })
  if (!exist) return null

  const answer = await Answer.create({
    question: questionId,
    description,
    author: user._id, //tas från token som ingen kan svara i annans namn
  })

  //create() ger bara author-id, hämta namnet så svaret se likadant ut som i listan
  await answer.populate('author', 'name')
  return toPublicAnswer(answer)
}

module.exports = { listAnswers, createAnswer }
