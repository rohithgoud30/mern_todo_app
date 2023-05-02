import mongoose from 'mongoose'

export const UserModel = mongoose.model(
  'users',
  mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
)
