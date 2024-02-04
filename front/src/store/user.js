// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole'

export const useUserStore = defineStore('user', () => {
  // 'useUserStore'、'user' 與檔名user相同
  const token = ref('')
  const account = ref('')
  const email = ref('')
  const cart = ref(0)
  const role = ref(UserRole.USER)
  // 和 controller 的 result 一樣

  const login = (data) => {
    token.value = data.token
    account.value = data.account
    email.value = data.email
    cart.value = data.cart
    role.value = data.role
  }

  // 判斷有沒有登入的條件是 token長度是否大於0
  const isLogin = computed(() => {
    return token.value.length > 0
  })

  const isAdmin = computed(() => {
    return role.value === UserRole.ADMIN
  })

  return {
    token,
    account,
    email,
    cart,
    role,
    login,
    isLogin,
    isAdmin
  }
}, {
  // LocalStorage
  persist: {
    key: '20240124',
    paths: ['token']
  }
})
