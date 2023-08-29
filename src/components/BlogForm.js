import React, { useState } from "react"

const BlogForm = (props) => {
  return (
	<form onSubmit={props.addBlog}>
      <div>
        <label>Title: </label>
        <input
          type='text'
          value={props.newBlog.title}
          name='title'
          onChange={props.handleBlogChange}
        />
      </div>
      <div>
        <label>Author: </label>
        <input
          type='text'
          value={props.newBlog.author}
          name='author'
          onChange={props.handleBlogChange}
        />
      </div>
      <div>
        <label>Url: </label>
        <input
          type='text'
          value={props.newBlog.url}
          name='url'
          onChange={props.handleBlogChange}
        />
      </div>
      <button type='button' onClick={props.cancelForm}>
		cancel
	  </button>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm