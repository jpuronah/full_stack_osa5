import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState('')
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs( initialBlogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log('TOKENUSER', user.token)
      blogService.setToken(user.token)
      console.log(user.token)
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
      //console.log('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
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
      user: user,
      likes: 0

    }
    blogService
      .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewBlog({
            title: '',
            author: '',
            url: ''
          })
          //console.log(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
          setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        })
  }

  const handleBlogChange = (event) => {
    const variableName = event.target.name
    const newValue = event.target.value

    //setNewBlog(event.target.value)
    setNewBlog({...newBlog, [variableName]: newValue})
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type='text'
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              />
          </div>
          <div>
            password
              <input
                type='password'
                value={password}
                name='Password'
                onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>{user.name} logged in<button onClick={handleLogout}>Logout</button></p>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>Title: </label>
          <input
            type='text'
            value={newBlog.title}
            name='title'
            onChange={handleBlogChange}
          />
        </div>
        <div>
          <label>Author: </label>
          <input
            type='text'
            value={newBlog.author}
            name='author'
            onChange={handleBlogChange}
          />
        </div>
        <div>
          <label>Url: </label>
          <input
            type='text'
            value={newBlog.url}
            name='url'
            onChange={handleBlogChange}
          />
        </div>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App



/*const loginForm = () => (
    <form onSubmit={handleLogin}>
    <div>
      username
      <input
      type="text"
      value={username}
      name="Username"
      onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
      type="password"
      value={password}
      name="Password"
      onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
    </form>      
	)*/