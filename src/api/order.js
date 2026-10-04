import request from '../utils/request'

export const createOrder = (data) => {
  return request.post('/order/create', data)
}

export const getOrderList = () => {
  return request.get('/order/list')
}

export const getOrderDetail = (id) => {
  return request.get(`/order/detail/${id}`)
}

export const cancelOrder = (id) => {
  return request.post(`/order/cancel/${id}`)
}