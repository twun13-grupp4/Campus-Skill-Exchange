/**
 * Question model. Asked by a user about a course.
 * school is copied from the course so questions can be filtered by school directly.
 */
const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    // copied from the course's school when the question is created, kept for filtering
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
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

// filtering: school + course + status, used by GET /api/questions?school=&course=&status=
questionSchema.index({ school: 1, course: 1, status: 1 })

module.exports = mongoose.model('Question', questionSchema)
