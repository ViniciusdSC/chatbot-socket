import axios from 'axios'

const instance = ({ token }) => axios.create({
  baseURL: process.env.AUTH_URL,
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const authorizate = ({ token }) => instance({ token }).post('authorizate')

export {
  instance,
  authorizate
}