import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [addedMessage, setAddedMessage] = useState(null)
  const [notAddedMessage, setNotAddedMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>

      setBlogs((blogs.sort((a, b) => b.likes - a.likes)))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setAddedMessage(
        `Added ${returnedBlog.title}`
      )

      setTimeout(() => {
        setAddedMessage(null)
      }, 5000)
    } catch (error) {
      setNotAddedMessage(
        `${error.response.data.error}`
      )
      setTimeout(() => {
        setNotAddedMessage(null)
      }, 5000)
    }
  }

  const handleDeleteOf = async (blogToDelete) => {
    if (window.confirm(`Delete ${blogToDelete.title}?`)) {
      try {
        await blogService.erase(blogToDelete.id)

        setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.id !== blogToDelete.id))

      } catch (error) {
        setNotAddedMessage(error.response?.data?.error || 'Error deleting blog')
        setTimeout(() => {
          setNotAddedMessage(null)
        }, 5000)
      }
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setPassword('')
    setUsername('')
    blogService.setToken(null)
  }


  const handleLikeOf = async (id) => {
    try {
      const blog = blogs.find((n) => n.id === id)
      const changedBlog = { ...blog, likes: blog.likes + 1 }

      const returnedBlog = await blogService.update(id, changedBlog)

      const updatedBlogs = blogs
        .map((blog) => (blog.id !== id ? blog : returnedBlog))
        .sort((a, b) => b.likes - a.likes)

      setBlogs([...updatedBlogs])
    } catch (error) {
      setErrorMessage('Blog was already removed from server')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='New Blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
  }

  return (
    <div>
      <Notification message={errorMessage} className='notAdded' />
      <Notification message={addedMessage} className='added' />
      <Notification message={notAddedMessage} className='notAdded' />

      {user === null ? (
        loginForm()
      ) : (
        <>
          <h2>blogs</h2>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>
          {blogForm()}
          {blogs.map(blog => (
            <Blog
            key={blog.id}
            user={user}
            blog={blog}
            handleLike={() => handleLikeOf(blog.id)}
            handleDelete={() => handleDeleteOf(blog)}
            updateBlog={updateBlog}
            />
          ))}
        </>
      )}


    </div>
  )
}

export default App