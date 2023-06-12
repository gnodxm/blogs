const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = req => {
	const authorization = req.get('authorization')
	if (authorization && authorization.statsWith('Bearer ')) {
		return authorization.replace('Bearer ','')
	}
	return null
}

blogsRouter.get('/', async (req,res) => {
  const blogs = await Blog.find({})
    res.json(blogs)
})

blogsRouter.get('/:id', (req, res,  next) => {
  Blog.findById(req.params.id)
    .then(blog => {
      if (blog) {
        res.json(blog)
      }  else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (req, res) => {
	const body = req.body

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	if(!decodedToken.id) {
		res.status(401).json({error: 'token invalid'})
	}

	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes||0,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog)
	await user.save()

	res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
	const body = req.body
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new: true})
		res.json(updatedBlog)
})

module.exports = blogsRouter