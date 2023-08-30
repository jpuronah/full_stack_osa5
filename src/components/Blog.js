import React, {useState} from "react"

const Blog = ({blog, user, handleLike, handleDelete}) => {
  const [expanded, setExpanded] = useState(false)
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

  return (
    <div style={blogStyle}>
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
          <p>User: {user}</p>
          <button onClick={() => handleDelete(blog.id)}>Remove</button>
        </div>
      )}
    </div>
  )  
}

export default Blog