const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['answer', 'upvote', 'accepted'],
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
