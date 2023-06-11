const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
	test('all blogs are returned as json', async () =>  {
		await api.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/) 
	})
})

describe('when a blog is posted', () => {
	test('Unique identifier property is named id', async () => {
		const respond = await api.get('/api/blogs')
		const ids = respond.body.map(blog => blog.id)
		expect(ids).toBeDefined()
	})
	
	test('HTTP POST to create a new blog post', async () => {
		const newBlog = {
			title: 'Serverless NodeJS: Everything to Know About',
			author: 'Divyesh Maheta',
			url: 'https://www.bacancytechnology.com/blog/serverless-nodejs',
			likes: 10
		}
		await api.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
	
		const titles = blogsAtEnd.map(b => b.title)
		expect(titles).toContain('Serverless NodeJS: Everything to Know About')
	})
		
	test('if missing, blog like will default to 0', async () => {
		const newBlog = {
			title: 'Serverless NodeJS: Everything to Know About',
			author: 'Divyesh Maheta',
			url: 'https://www.bacancytechnology.com/blog/serverless-nodejs',
		}
	
		const resultBlog = await api.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
	
		expect(resultBlog.body.likes).toBe(0)
	})
	
	test('if the title or url properties are missing, send 400 Bad Request', async () => {
		const invalidBlog= {
			author: 'Divyesh Maheta',
			url: 'https://www.bacancytechnology.com/blog/serverless-nodejs',
		}
		await api.post('/api/blogs')
			.send(invalidBlog)
			.expect(400)
	})
})

describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
		
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const titles = blogsAtEnd.map(b => b.title)
		expect(titles).not.toContain(blogToDelete.title)
	})
})

describe.only('When update information of a blog', () => {
	test('successfully update blog likes', async() => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0] 

		const updatedBlog = { ...blogToUpdate, likes:blogToUpdate.likes + 1}

		await api.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedBlog)
			.expect('Content-Type',/application\/json/)
		
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd[0].likes).toEqual(helper.initialBlogs[0].likes + 1)
	})
})


afterAll(async () => {
  await mongoose.connection.close()
})