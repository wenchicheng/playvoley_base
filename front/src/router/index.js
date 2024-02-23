// Composables
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router'
import { useUserStore } from '@/store/user'
import { fa } from 'vuetify/lib/locale/index.mjs'

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
        path: 'myappointment',
        name: 'Myappointment',
        component: () => import('@/views/front/MyappointmentView.vue'),
        meta: {
          title: '一起來打排 | 我的預約',
          login: true,
          admin: false
        }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('@/views/front/ShopView.vue'),
        meta: {
          title: '一起來打排 | 排球選物',
          login: false,
          admin: false
        }
      },
      {
        path: 'products/:id',
        name: 'Product',
        component: () => import('@/views/front/ProductView.vue'),
        meta: {
          title: '一起來打排 | 商品介紹',
          login: false,
          admin: false
        }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/front/CartView.vue'),
        meta: {
          title: '一起來打排 | 購物車',
          login: true,
          admin: false
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/front/OrdersView.vue'),
        meta: {
          title: '一起來打排 | 訂單',
          login: true,
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
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('@/views/admin/HomeView.vue'),
        meta: {
          title: '一起來打排 | 後台管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'appointments',
        name: 'AdminAppointments',
        component: () => import('@/views/admin/AppointmentsView.vue'),
        meta: {
          title: '一起來打排 | 開放時段管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'appointorders',
        name: 'AdminAppointorders',
        component: () => import('@/views/admin/AppointordersView.vue'),
        meta: {
          title: '一起來打排 | 預約管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductsView.vue'),
        meta: {
          title: '一起來打排 | 商品管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrdersView.vue'),
        meta: {
          title: '一起來打排 | 訂單管理',
          login: true,
          admin: true
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
router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  if (from === START_LOCATION) {
    await user.getProfile()
  }

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
