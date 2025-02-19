import styles from './Blog.module.css'
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLike, handleDelete, user, updateBlog }) => {
  const [visible, setVisible] = useState(false)
  const [showAllAttributes, setShowAllAttributes] = useState(blog.showAllAttributes || false)

  useEffect(() => {
    if (user.id === blog.user.id) {
      setVisible(true)
    }
  }, [user.id, blog.user.id])

  const toggleAttributes = async () => {
    const updatedBlog = { ...blog, showAllAttributes: !showAllAttributes }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setShowAllAttributes(!showAllAttributes)
      updateBlog(returnedBlog)
    } catch (error) {
      console.error('Error updating blog visibility:', error)
    }
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const label = showAllAttributes ? 'hide attributes' : 'show attributes'

  return (
    <div className={`${styles.blog}`}  data-testid = 'blog'>
      {blog.title} {blog.author}
      <button onClick={toggleAttributes}>{label}</button>

      {showAllAttributes && (
        <>
          <div>{blog.url}</div>
          <div>
            <p data-testid="likes">Likes {blog.likes} <span><button onClick={handleLike}>Like</button></span></p>
          </div>
          <div>{blog.user.name}</div>
        </>
      )}

      <button style={showWhenVisible} onClick={handleDelete}> Delete </button>
    </div>
  )
}

export default Blog
