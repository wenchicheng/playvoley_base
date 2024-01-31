import axios from 'axios'

// 建立 axios instance 實例設定
export const api = axios.create({
  baseURL: import.meta.env.VITE_API
})
