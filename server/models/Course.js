/**
 * Course model. Belongs to one school and can be part of several programs.
 * Course names are unique per school.
 */
const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    // the programs this course is part of (a course can belong to several)
    programs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
      },
    ],
  },
  { timestamps: true },
)

// the same course name can exist at several schools, but only once per school
courseSchema.index({ school: 1, name: 1 }, { unique: true })

module.exports = mongoose.model('Course', courseSchema)
