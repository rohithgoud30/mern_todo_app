import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { connectDB } from './db.js'
import { UserModel } from './models/userModel.js'
import { TodoModel } from './models/todoModel.js'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)
app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({ body: 'ok' })
})

app.put('/todos', async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
  try {
    const newTodo = await TodoModel.create({
      text: req.body.text,
      done: req.body.done,
      user_id: new mongoose.Types.ObjectId(decoded.id),
    })
    res.status(201).json({ text: newTodo.text, done: newTodo.done })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/todos', async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
  try {
    await TodoModel.updateOne(
      {
        _id: req.body.id,
        user_id: new mongoose.Types.ObjectId(decoded.id),
      },
      { done: req.body.done }
    )
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/todos', async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
  try {
    const todo = await TodoModel.find({
      user_id: new mongoose.Types.ObjectId(decoded.id),
    })
    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/user', async (req, res) => {
  if (req.cookies.token) {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    const user = await UserModel.findById(decoded.id)
    if (user) {
      res.status(200).json({ email: user.email })
    }
  }
})

app.get('/logout', async (req, res) => {
  res.status(200).cookie('token', '').send()
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.findOne({ email })
    const passOK = await bcrypt.compare(password, user.password)
    if (passOK) {
      try {
        jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
          if (err) throw err
          else {
            res
              .status(200)
              .cookie('token', token)
              .json({ id: user._id, email: user.email })
          }
        })
      } catch (error) {
        res.status(400).json({ message: error.message })
      }
    } else {
      res.status(400).json({ message: 'Wrong password' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
      const newUser = await UserModel.create({
        email,
        password: hashedPassword,
      })
      jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err
        else {
          res
            .status(201)
            .cookie('token', token)
            .json({ id: newUser._id, email: newUser.email })
        }
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running at ${port}`)
})
