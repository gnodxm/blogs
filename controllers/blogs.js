const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userExtractor = require('../ultils/middleware').userExtractor


blogsRouter.get('/', async (req,response) => {
  const blogs = await Blog.find({})
		.populate('user',{username: 1, name: 1,  id: 1 })
	response.json(blogs)
})

blogsRouter.get('/:id', (req, response,  next) => {
  Blog.findById(req.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      }  else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/',userExtractor, async (req, response) => {
	const body = req.body

	const decodedToken = jwt.verify(req.token, process.env.SECRET)
	if(!decodedToken.id) {
		return response.status(401).json({error: 'token invalid'})
	}

	

	const blog = new Blog({
		title: body.title,
		author: req.user.username,
		url: body.url,
		likes: body.likes||0,
		user: req.user._id
	})
	console.log(req.user);

	const savedBlog = await blog.save()
	req.user.blogs = req.user.blogs.concat(savedBlog)
	await req.user.save()

	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
	const blogToDelete = await Blog.findById(req.params.id)
	if (!blogToDelete) {
		return res.status(400).json({error: 'Not found'})
	} else	if (!(req.user.id && req.user.id  ===  blogToDelete.user.toString()))  {
		return res.status(401).json({error: 'Not authorized'})
	}

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