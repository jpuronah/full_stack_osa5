import '../index.css'

const Notification = ({ message, notification }) => {
  if (message === null) {
    return null
  }
  if (message === 'wrong username or password') {
    return (
      <div className="error">
    	{message}
      </div>
    ) } else if (message.includes('a new blog') ){
    return (
      <div className="success">
    	{message}
      </div>
    )}
}
  
export default Notification
