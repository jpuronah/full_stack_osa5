import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  console.log('CREATE')
  const config = {
    headers: { Authorization: token },
  }
  console.log('Auth OK')
  const response = await axios.post(baseUrl, newObject, config)
  console.log('Post OK')
  return response.data
}

const update = async (id, updatedBlog) => {
  console.log('UPDATE')
  console.log(updatedBlog)
  const config = {
    headers: { Authorization: token },
  }
  console.log('Auth OK')
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  console.log('Put OK')
  console.log(response.data)
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('Auth OK')
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  console.log('Delete OK')
  console.log(response.data)
  return response.data;
}


// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken, update, remove }