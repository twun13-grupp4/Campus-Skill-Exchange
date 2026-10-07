const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseTag: { type: String, required: true },
    school: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['unanswered', 'answered'],
      default: 'unanswered',
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null,
    },
  },
  { timestamps: true },
)

questionSchema.index({ school: 1, courseTag: 1, status: 1 })

module.exports = mongoose.model('Question', questionSchema)
