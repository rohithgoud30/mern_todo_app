import mongoose from 'mongoose'

export const TodoModel = mongoose.model(
  'todos',
  mongoose.Schema({
    text: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  })
)
