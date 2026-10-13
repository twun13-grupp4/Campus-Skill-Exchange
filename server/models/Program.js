const mongoose = require('mongoose')

const programSchema = new mongoose.Schema(
  {
    // one shared entry per program name, so it shows up once in the filters
    name: { type: String, required: true, unique: true, trim: true },
    // the schools that offer this program
    schools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Program', programSchema)
