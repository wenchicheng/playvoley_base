// 攔截器
import { useUserStore } from '@/store/user'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// req送出請求的攔截器順序
// 1. 呼叫 axios.get / axios.post 時
// 2. 會先經過請求攔截器 interceptors.request
// 3. 送出請求
// 4. 送出請求後，回應攔截器 interceptors.response
// 5. 最後才會回傳結果，呼叫的地方的 .then .catch 才會執行
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  // "Bearer" 一種 HTTP 認證方案，常用於 Web 應用程式的身份驗證
  return config
})

export const useApi = () => {
  return { api, apiAuth }
}
