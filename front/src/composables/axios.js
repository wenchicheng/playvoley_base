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

// apiAuth.interceptors.response(成功時執行，失敗時執行)
apiAuth.interceptors.response.use(res => {
  return res
}, (error) => {
  // 如果失敗有收到回應
  if (error.response) {
    // 如果是 JWT 過期，且不是換新 token 的請求
    if (error.response.data.message === 'JWT 過期' && error.config.url !== '/users/extend') {
      const user = useUserStore()
      // 傳送舊換新請求
      return apiAuth.patch('/users/extend')
        .then(({ data }) => {
          // 更新 pinia 保存的 token
          user.token = data.result
          // 修改發生錯誤的原請求設定的 JWT
          error.config.headers.Authorization = 'Bearer ' + user.token
          // 重新發送原請求
          return axios(error.config)
        })
        .catch(() => {
          // 如果舊換新 token 失敗，登出
          user.logout()
          // 回傳原錯誤到呼叫的地方
          return Promise.reject(error)
        })
    }
  }
  // 如果請求沒有收到回應，或不是 JWT 過期，或換新 token 失敗，回傳原錯誤到呼叫的地方
  return Promise.reject(error)
})

export const useApi = () => {
  return { api, apiAuth }
}
