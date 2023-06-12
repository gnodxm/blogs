const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
	const { username, name, password } = req.body

	if (password.length <3) {
		res.status(400).json({error: "Not enough number of password character required"})
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash
	})

	const savedUser = await user.save()
	res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
	const users = await User.find({})
		.populate('blogs', {url: 1,  title: 1, author: 1, id: 1})
	res.json(users)
})

module.exports = usersRouter