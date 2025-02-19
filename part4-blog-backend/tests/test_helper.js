const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "Understanding JavaScript Closures",
      author: "John Doe",
      url: "https://example.com/js-closures",
      likes: 120
    },
    {
      title: "A Guide to MongoDB Indexing",
      author: "Jane Smith",
      url: "https://example.com/mongodb-indexing",
      likes: 85
    }
  ]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}