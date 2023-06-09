const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBLogs)
})

test('all blogs are returned as json', async () =>  {
  console.log(helper.blogsInDb());
   await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/) 
}, 100000)
  
afterAll(async () => {
  await mongoose.connection.close()
})