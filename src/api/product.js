import request from '../utils/request'

export const getProductList = (params) => {
  return request.get('/product/list', { params })
}

export const getProductDetail = (id) => {
  return request.get(`/product/detail/${id}`)
}