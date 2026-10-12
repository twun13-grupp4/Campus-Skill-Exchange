const mongoose = require('mongoose')

const programSchema = new mongoose.Schema(
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

// the same program name can exist at several schools, but only once per school
programSchema.index({ school: 1, name: 1 }, { unique: true })

module.exports = mongoose.model('Program', programSchema)
