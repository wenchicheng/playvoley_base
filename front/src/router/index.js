// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/HomeView.vue'),
        meta: {
          title: '一起來打排',
          login: false,
          admin: false
        }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/front/AboutView.vue'),
        meta: {
          title: '一起來打排 | 介紹',
          login: false,
          admin: false
        }
      },
      {
        path: 'appointment',
        name: 'Appointment',
        component: () => import('@/views/front/AppointmentView.vue'),
        meta: {
          title: '一起來打排 | 預約',
          login: false,
          admin: false
        }
      },
      {
        path: 'news',
        name: 'News',
        component: () => import('@/views/front/NewsView.vue'),
        meta: {
          title: '一起來打排 | 最新消息',
          login: false,
          admin: false
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/front/RegisterView.vue'),
        meta: {
          title: '一起來打排 | 註冊',
          login: false,
          admin: false
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/front/LoginView.vue'),
        meta: {
          title: '一起來打排 | 登入',
          login: false,
          admin: false
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

// 進到每頁之後改標題(document.title)
router.beforeEach((to, from) => {
  document.title = to.meta.title
})

// 頁面攔截
router.beforeEach((to, from, next) => {
  const user = useUserStore()

  if (user.isLogin && ['/register', '/login'].includes(to.path)) {
    // 如果使用者有登入，且要去的路徑是/register', '/login'，重新導向到首頁next('/')
    next('/')
  } else if (to.meta.login && !user.isLogin) {
    // 如果要去的頁面要登入，但沒登入，重新導向到登入頁
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 如果要去的頁面要管理員，但不是管理員，重新導向回首頁
    next('/')
  } else {
    // 不重新導向
    next()
  }
})

export default router