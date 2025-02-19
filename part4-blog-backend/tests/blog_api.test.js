const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const assert = require('node:assert')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('adding invalid users', () => {
  test.only('username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Corto',
      password: '123456'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('User validation failed'))
  })

  test.only('password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'asab',
      name: 'Corto',
      password: '12'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('Password must be at least 3 characters long'))
  })

  test.only('missing username field', async () => {
    const newUser = {
      name: 'Corto',
      password: '12hfgjhf'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('User validation failed'))
  })
})

describe('when there is initially some notes saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert(titles.includes('Understanding JavaScript Closures'))
  })

})

describe('viewing a specific blog', () => {

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

})

describe('addition of a new note', () => {

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "Understanding JavaScript Closures",
      author: "John Doe",
      url: "https://example.com/js-closures",
      likes: 120
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)

    assert(titles.includes('Understanding JavaScript Closures'))
  })

  test('if blog.likes is undefined it is assigned to 0', async () => {
    const newBlog = {
      title: "Understanding JavaScript Closures",
      author: "John Doe",
      url: "https://example.com/js-closures",
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body.likes, 0)
  })

  test('attribute name is id and not _id', async () => {
    const newBlog = {
      title: "Understanding JavaScript Closures",
      author: "John Doe",
      url: "https://example.com/js-closures",
      likes: 120
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.id, 'El atributo id debe estar definido')
  })

  test('blog without author or url is not added', async () => {
    const newBlog = {
      author: "Juancito",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()


    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

})

describe('deletion of a note', () => {

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

})

describe('updating notes', () => {

  test.only('', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
  })

})

after(async () => {
  await mongoose.connection.close()
})