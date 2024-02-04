// 攔截器
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

export const useApi = () => {
  return { api, apiAuth }
}
