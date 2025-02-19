const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favoriteBlog', () => {
    test('of empty list returns "empty blog list"', () => {
        const blogs = []
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, "empty blog list")
    })

    test('when list has only one blog, it returns that blog', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }]
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('returns the blog with the most likes from a larger list', () => {
        const blogs = [
            {
                _id: '1',
                title: 'First Blog',
                author: 'Alice',
                url: 'https://example.com/1',
                likes: 2,
                __v: 0
            },
            {
                _id: '2',
                title: 'Second Blog',
                author: 'Bob',
                url: 'https://example.com/2',
                likes: 8,
                __v: 0
            },
            {
                _id: '3',
                title: 'Third Blog',
                author: 'Charlie',
                url: 'https://example.com/3',
                likes: 5,
                __v: 0
            }
        ]
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {
            title: 'Second Blog',
            author: 'Bob',
            likes: 8
        })
    })

    test('returns the first blog with the highest likes in case of tie', () => {
        const blogs = [
            {
                _id: '1',
                title: 'First Blog',
                author: 'Alice',
                url: 'https://example.com/1',
                likes: 10,
                __v: 0
            },
            {
                _id: '2',
                title: 'Second Blog',
                author: 'Bob',
                url: 'https://example.com/2',
                likes: 10,
                __v: 0
            }
        ]
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {
            title: 'First Blog',
            author: 'Alice',
            likes: 10
        })
    })
})
