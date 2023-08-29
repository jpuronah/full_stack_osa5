const LoginForm = (props) => {
	/*return (
	  <div>
		<h2>Log in to application</h2>
		<Notification message={errorMessage} notification={notification} />
        <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            //type="text"
            value={username}
            //name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            //name="Password"
            onChange={handlePasswordChange}
			//onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
        </form>
	  </div>
	)*/
	return (
		<div>
		  {console.log("LoginForm")}
		  <h2>Log in to application</h2>
		  <props.Notification message={props.errorMessage} notification={props.notification} />
		  <form onSubmit={props.handleSubmit}>
			<div>
			  username
				<input
				type='text'
				value={props.username}
				name="Username"
				onChange={props.handleUsernameChange}
				/>
			</div>
			<div>
			  password
				<input
				  type='password'
				  value={props.password}
				  name='Password'
				  onChange={props.handlePasswordChange}
				/>
			</div>
			<button type='submit'>login</button>
		  </form>
		</div>
	  )
}

export default LoginForm