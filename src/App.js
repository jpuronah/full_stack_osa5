import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

let globalUser = null
const globalTimeOut = 50000000

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

  const [sortedBlogs, setSortedBlogs] = useState([])
  const [newlyAddedBlog, setNewlyAddedBlog] = useState(null)

  const [loginVisible, setLoginVisible] = useState(false)
  const [newBlogVisible, setNewBlogVisible] = useState(false)

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
    //globalUser = username
    /*setTimeout(() => {
      global = null
    }, globalTimeOut)*/
  }

  const handleLogout = () => {
    console.log("handleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogouthandleLogout")
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    //globalUser = null
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
    console.log('USER adding blog', blogObject.user)
    console.log('AddBlog blogService')
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs([...blogs, returnedBlog])
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
      setNewlyAddedBlog(returnedBlog)
      console.log(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
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
    /*blogService
      .create(blogObject)
        .then(returnedBlog => {
          //setBlogs(blogs.concat(returnedBlog))
          setBlogs([...blogs, returnedBlog])
          setNewBlog({
            title: '',
            author: '',
            url: '',
            user: ''
          })
          console.log(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
          setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`error adding blog`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })*/
  }

  const handleBlogChange = (event) => {
    const variableName = event.target.name
    const newValue = event.target.value

    //setNewBlog(event.target.value)
    setNewBlog({...newBlog, [variableName]: newValue})
  }

  const handleLike = async (blog) => {
    console.log("HANDLE LIKE")
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      //console.log(blog)
      //console.log(updatedBlog)
      //console.log("IIDEE", blog.id)
      const response = await blogService.update(blog.id, updatedBlog)
      //console.log("responsedata", response);
      //setBlogs(blogs.map(b => (b.id === blog.id ? response.data: b)))
      //console.log(response.id)
      //console.log(blog.id, response.id)
      setBlogs((prevBlogs) => {
        console.log(prevBlogs)
        const updatedBlogs = prevBlogs.map((b) => 
          b.id === blog.id ? response: b
        )
        console.log(updatedBlogs)
        return updatedBlogs
      })
      } catch (error) {
        setErrorMessage(`error liking a blog`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
    }
    console.log("HANDLE LIKE")
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
      {console.log('App return start')}
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {/*{!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        </div>
      }*/}
      <p>{user.name} logged in<button onClick={handleLogout}>Logout</button></p>
      <h2>create new</h2>
      {!newBlogVisible ? (
        <button onClick={toggleNewBlog}>New Blog</button>
      ) : (
        <div>
          <BlogForm addBlog={addBlog} cancelForm={cancelForm} newBlog={newBlog} handleBlogChange={handleBlogChange} />
        </div>
      )}
      {console.log('user?', user)}
      {console.log('Blog RENDER')}
      {console.log('BLoG', blogs)}
      
      {/*blogs.filter(blog => blog)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user.username} handleLike={handleLike}/>
      )*/}
      {sortedBlogs.filter(blog => blog)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user.username} handleLike={handleLike} handleDelete={handleDelete} newlyAddedBlog={newlyAddedBlog}/>
      )}
      {/*blogs.map(blog =>
        blog ? (
          <Blog key={blog.id} blog={blog} user={user.username} handleLike={handleLike}/>
        ) : null
      )*/}
      {console.log('App return end')}
    </div>
  )
}

export default App
