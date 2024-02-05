// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole'
import { useApi } from '@/composables/axios'

export const useUserStore = defineStore('user', () => {
  // 'useUserStore'、'user' 與檔名user相同
  const { apiAuth } = useApi()

  const token = ref('')
  const account = ref('')
  const email = ref('')
  const cart = ref(0)
  const role = ref(UserRole.USER)
  // 和 controller 的 result 一樣

  const login = (data) => {
    if (data.token) {
      token.value = data.token
    }
    account.value = data.account
    email.value = data.email
    cart.value = data.cart
    role.value = data.role
    // console.log('111111', role.value)
  }

  // 判斷有沒有登入的條件是 token長度是否大於0
  const isLogin = computed(() => {
    return token.value.length > 0
  })

  const isAdmin = computed(() => {
    // console.log('role.value', role.value)
    // console.log('UserRole.ADMIN', UserRole.ADMIN)
    return Number(role.value) === UserRole.ADMIN
  })

  const getProfile = async () => {
    if (token.value.length === 0) return

    try {
      const { data } = await apiAuth.get('/users/me')
      // '/user/me' 這個路徑是後端給的 => back\routes\users.js 的router.get('/me', auth.jwt, getProfile)
      // 回傳的結果 back\controllers\users.js 的 export const getProfile = (req, res)
      login(data.result)
    } catch (error) {
      console.log(error)
      logout()
    }
  }

  const logout = () => {
    token.value = ''
    account.value = ''
    email.value = ''
    cart.value = 0
    role.value = UserRole.USER
  }

  return {
    token,
    account,
    email,
    cart,
    role,
    login,
    logout,
    isLogin,
    isAdmin,
    getProfile
  }
}, {
  // LocalStorage
  persist: {
    key: '20240124',
    paths: ['token']
  }
})
