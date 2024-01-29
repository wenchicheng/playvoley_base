// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

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
          title: '一起來打排'
        }
      },
      // {
      //   path: 'register',
      //   name: 'Register',
      //   component: () => import('@/views/front/RegisterView.vue'),
      //   meta: {
      //     title: '一起來打排 | 註冊'
      //   }
      // },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/front/LoginView.vue'),
        meta: {
          title: '一起來打排 | 登入'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  document.title = to.meta.title
})

export default router
