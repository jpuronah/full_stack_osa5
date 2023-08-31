import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [newBlogVisible, setNewBlogVisible] = useState(false)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const toggleNewBlog = () => {
    setNewBlogVisible(!newBlogVisible)
  }

  const cancelForm = () => {
    setNewBlogVisible(false)
  }
  
  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs( initialBlogs )
    )
  }, [])

  useEffect(() => {
    const sorted = [...blogs]

    sorted.sort((a, b) => b.likes - a.likes)
    setSortedBlogs(sorted)
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
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
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      url: newBlog.url,
      title: newBlog.title,
      author: newBlog.author,
      user: user.username,
      likes: 0
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs([...blogs, returnedBlog])
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
      setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(`error adding blog`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    const variableName = event.target.name
    const newValue = event.target.value

    setNewBlog({...newBlog, [variableName]: newValue})
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      const response = await blogService.update(blog.id, updatedBlog)
      setBlogs((prevBlogs) => {
        const updatedBlogs = prevBlogs.map((newBlog) => 
          newBlog.id === blog.id ? response: newBlog
        )
        return updatedBlogs
      })
      } catch (error) {
        setErrorMessage(`error liking a blog`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    if (window.confirm(`Remove blog "${blogToDelete.title}" by "${blogToDelete.author}"`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (error) {
        setErrorMessage(`error deleting blog`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
      }
    }
  }

  if (user === null) {
   return (
    <LoginForm
      errorMessage={errorMessage}
      Notification={Notification}
      handleSubmit={handleLogin}
      username={username}
      password={password}
      handleUsernameChange={(event) => setUsername(event.target.value)}
      handlePasswordChange={(event) => setPassword(event.target.value)}
    />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>{user.name} logged in<button onClick={handleLogout}>Logout</button></p>
      <h2>create new</h2>
      {!newBlogVisible ? (
        <button onClick={toggleNewBlog}>New Blog</button>
      ) : (
        <div>
          <BlogForm addBlog={addBlog} cancelForm={cancelForm} newBlog={newBlog} handleBlogChange={handleBlogChange} />
        </div>
      )}

      {sortedBlogs.filter(blog => blog)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user.username} handleLike={handleLike} handleDelete={handleDelete} />
      )}
    </div>
  )
}

export default App
