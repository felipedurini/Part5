const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body

        if (!password || password.length < 3) {
            const error = new Error('Password must be at least 3 characters long')
            error.name = 'ValidationError'
            return next(error)
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({ username, name, passwordHash })
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs')

    response.json(users)
})

module.exports = usersRouter