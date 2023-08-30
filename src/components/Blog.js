import React, {useState} from "react"

const Blog = ({blog, user, handleLike, handleDelete, newlyAddedBlog}) => {
  const [expanded, setExpanded] = useState(false)

  console.log("BLOG COMPONENT")
  const toggleExpanded = () => {
    setExpanded(!expanded)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButton = user && user.username === blog.user.username

  return (
    <div style={blogStyle}>
      {console.log('Blog return start')}
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExpanded}>
          {expanded ? "Hide" : "View"}
        </button>
      </div>
      {expanded && (
        <div>
          <p>Url: {blog.url}</p>
          <p>Title: {blog.title}</p>
          <p>Author: {blog.author}</p>
          <p> 
            Likes: {blog.likes} 
            <button onClick={() => handleLike(blog)}>Like</button>
          </p>
          {console.log('PAINETAAN NAPPIA LIKELLE TÄÄLLÄ')}
          <p>User: {user}</p>
          <button onClick={() => handleDelete(blog.id)}>Remove</button>
          {/*removeButton && (
            <button onClick={() => handleDelete(blog.id)}>Remove</button>
          )*/}
          {/*user === blog.user || blog === newlyAddedBlog ? (
            <button onClick={() => handleDelete(blog.id)}>Remove</button>
          ) : null*/}
          {/*) && (
            <button onClick={() => handleDelete(blog.id)}>Remove</button>
          )}*/}
          {/*<p>User: {blog.user.username}</p>*/}
          {/*<p>User: {blog.user}</p>*/}
        </div>
      )}
      {console.log('Blog return end')}
    </div>

  )  
}

export default Blog