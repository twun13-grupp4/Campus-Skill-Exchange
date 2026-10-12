const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
  },
  { timestamps: true },
)

// the same course name can exist at several schools, but only once per school
courseSchema.index({ school: 1, name: 1 }, { unique: true })

module.exports = mongoose.model('Course', courseSchema)
