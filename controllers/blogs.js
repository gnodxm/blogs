const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req,res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
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
