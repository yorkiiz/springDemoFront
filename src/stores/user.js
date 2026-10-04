import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, logout as logoutApi } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearToken = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
      return res.data
    } catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      clearToken()
    }
  }

  const isLoggedIn = () => {
    return !!token.value
  }

  return {
    token,
    userInfo,
    setToken,
    clearToken,
    fetchUserInfo,
    logout,
    isLoggedIn
  }
})