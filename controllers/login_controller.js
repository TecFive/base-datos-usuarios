const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user_model.js')

loginRouter.post('/', async (request, response) => {
    const { id_credencial, password } = request.body

    const user = await User.findOne({ id_credencial })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.hash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
        error: 'Invalid username or password'
        })
    }


    const userForToken = {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        id_credencial: user.id_credencial
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name, rol: user.rol })
})

module.exports = loginRouter
