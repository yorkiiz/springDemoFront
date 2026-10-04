import request from '../utils/request'

export const login = (data) => {
  const formData = new URLSearchParams()
  formData.append('username', data.username)
  formData.append('password', data.password)
  return request.post('/doLogin', formData)
}

export const register = (data) => {
  return request.post('/register', data)
}

export const logout = () => {
  return request.post('/logout')
}

export const getUserInfo = () => {
  return request.get('/user/info')
}