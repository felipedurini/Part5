const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('mostBlogs', () => {
    test('of empty list is zero', () => {
      const blogs = []
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, "empty blog list")
    })
    test('when list has only one blog equals the likes of that', () => {
      const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }]
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, {author: 'Edsger W. Dijkstra', blogs: 1})
    })
    test('of a bigger list is calculated right', () => {
      const blogs = [    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 3,
        __v: 0
      },     {
        _id: '8a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 6,
        __v: 0
      },     {
        _id: '7a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 2,
        __v: 0
      },     {
        _id: '6a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Leo Messi',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 17,
        __v: 0
      }]
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, {author: 'Edsger W. Dijkstra', blogs: 3})
    })
})