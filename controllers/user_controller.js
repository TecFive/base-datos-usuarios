const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user_model.js')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { nombre, email, id_credencial, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    nombre: nombre,
    email: email,
    id_credencial: id_credencial,
    hash: passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { nombre, email, id_credencial } = request.body

  const updatedUser = {
    nombre: nombre,
    email: email,
    id_credencial: id_credencial
  }

  const result = await User.findByIdAndUpdate(id, updatedUser, { new: true })

  response.json(result)
})

usersRouter.put('/password/:id', async (request, response) => {
  const { id } = request.params
  const { old_password, password } = request.body

  const user = await User.findById(id)
  const passwordCorrect = await bcrypt.compare(old_password, user.hash)

  if (!passwordCorrect) {
    return response.status(401).json({ error: 'Invalid password' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const updatedUser = {
    hash: passwordHash
  }

  const result = await User.findByIdAndUpdate(id, updatedUser, { new: true })

  response.json(result)
})

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await User.deleteOne({ _id: id })

  response.status(204).end()
})

module.exports = usersRouter
