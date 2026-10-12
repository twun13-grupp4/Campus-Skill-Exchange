const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'teacher', 'moderator'],
      default: 'student',
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    // must belong to the user's school, checked when registering
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// password is select: false, so the query must include .select('+password')
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
