const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
