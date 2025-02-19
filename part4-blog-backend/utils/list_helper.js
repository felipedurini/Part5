const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) =>{
    return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = (blogs) =>{
    let max = { title: "", author: "", likes: 0 }

    for (let blog of blogs) {
        let author = blog.author
        let blogLikes = blog.likes

        if (max.author === "" || max.likes < blogLikes) {
            max = { title: blog.title, author, likes: blogLikes }
        }
    }

    return max.author === "" ? "empty blog list" : max
}

const mostBlogs = (blogs) => {
    let max = { author: "", blogs: 0 }
    let blogMap = new Map()

    for (let blog of blogs) {
        let author = blog.author
        let authorBlogs = (blogMap.get(author) || 0) + 1

        blogMap.set(author, authorBlogs)

        if (authorBlogs > max.blogs) {
            max = { author, blogs: authorBlogs }
        }
    }

    return max.blogs === 0 ? "empty blog list" : max
}

const mostLikes = (blogs) => {
    let max = { author: "", likes: -1 }
    let blogMap = new Map()

    for (let blog of blogs) {
        let author = blog.author
        let authorLikes = (blogMap.get(author) || 0) + blog.likes

        blogMap.set(author, authorLikes)

        if (authorLikes > max.likes) {
            max = { author, likes: authorLikes }
        }
    }

    return max.likes === -1 ? "empty blog list" : max
}

module.exports = {
    dummy,
    totalLikes,
    mostBlogs,
    favoriteBlog,
    mostLikes
}