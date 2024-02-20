<template>
  <!-- 手機板和電腦版導航列共用的 drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list>
      <div class="d-flex justify-center mt-2 mb-4">
        <v-btn to="/login" v-if="!user.isLogin"
        class="d-flex align-center justify-center login">
        登入
        </v-btn>
      </div>
      <div class="d-flex justify-center mt-2 mb-4">
        <v-btn to="/register" v-if="!user.isLogin"
        class="d-flex align-center justify-center register">
        註冊
        </v-btn>
      </div>
      <div class="d-flex justify-center mt-2 mb-4">
        <v-btn @click="logout" v-if="user.isLogin"
        class="d-flex align-center justify-center logout">
        登出
        </v-btn>
      </div>
      <template v-for="item in navItems" :key="item.to">
        <v-list-item :to="item.to" class="d-flex align-center justify-center" v-if="item.show">
          <v-list-item-title class="list-title">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar
  :elevation="0"
  :class="{ 'navbar': isScrolled }"
  :style="{ backgroundColor: isScrolled ? 'rgba(224, 236, 246, 1)' : 'rgba(224, 236, 246, 0)' }"
  >
    <v-container class="d-flex align-center">
      <a href="/">
        <v-app-bar-title>
          <img src="@/assets/logo-05.png" alt="一起來打排" style="height: 40px">
        </v-app-bar-title>
      </a>
      <!-- <v-spacer></v-spacer> -->
    </v-container>
      <!-- 導航按鈕 -->
      <v-app-bar-nav-icon @click="drawer = true" class="menu-btn"></v-app-bar-nav-icon>
  </v-app-bar>

  <v-main>
    <RouterView></RouterView>
  </v-main>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'
// import LoginView from '@/views/front/LoginView.vue'
import RegisterComp from '@/components/RegisterComp.vue'
import LoginComp from '@/components/LoginComp.vue'
import { useUserStore } from '@/store/user'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'
// router 跳頁 / route 取資料，useRouter 跳頁導航，而 useRoute 獲取當前這頁的資訊

// 對話框預設關閉
const dialog = ref(false)

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const router = useRouter()

const user = useUserStore()

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機版惻欄開關
const drawer = ref(false)

const tab = ref('login')
// ref() 會回傳一個響應式的物件，並且會自動將 tab 的值轉換為響應式的資料，這樣當 tab 的值改變時，會自動重新渲染頁面

// 導覽列項目==================================
const navItems = computed(() => {
  return [
    { to: '/about', text: '場館介紹', show: true },
    { to: '/news', text: '最新消息', show: true },
    { to: '/appointment', text: '預約報名', show: true },
    { to: '/myappointment', text: '我的預約', show: user.isLogin },
    { to: '/shop', text: '排球選物', show: user.isLogin },
    { to: '/admin', text: '後台管理', show: user.isLogin && user.isAdmin }
  ]
})

// 導覽列效果====================================
const isScrolled = ref(false)

const handleScroll = () => {
  // 檢查滾動位置，根據需要添加或移除 'navbar' 類
  if (window.scrollY > 100) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

// 監聽滾動事件
window.addEventListener('scroll', handleScroll)

// 在組件被卸載前，移除滾動事件監聽器
const beforeUnmount = () => {
  window.removeEventListener('scroll', handleScroll)
}

// 登出========================================
const logout = async () => {
  try {
    await apiAuth.delete('/users/logout')
    user.logout()
    // dialog.value = false
    // 關閉對話框
    createSnackbar({
      text: '登出成功',
      showCloseButton: false,
      snackbarProps: {
        color: 'success',
        timeout: 2000,
        location: 'bottom'
      }
    })
    router.push('/') // 登出後回到首頁
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        color: 'error',
        timeout: 2000,
        location: 'top'
      }
    })
  }
}
</script>

<style scoped>
/* .no-hover:hover {
  background-color: inherit !important;
} */

.navbar{
  color:black;
  /* height: 64px; */
  font-weight: 600;
  border-bottom: 2px solid rgb(110, 171, 217);
}
/* 深度選擇器 */
.v-main::v-deep {
    --v-layout-top: 0 !important;
    --v-layout-bottom: 0 !important;
}

.menu-btn {
  width: 40px;
  height: 40px;
  min-width: 0;
  padding: 0;
  background-color: rgba(110, 171, 217,0.5);
  color: rgb(250, 253, 255);
  /* border: 2px solid rgb(110, 171, 217); */
}

.v-toolbar__content > .v-btn:last-child {
  margin-inline-end: 40px;
}
.list-title {
  font-size: 20px;
}

.login,
.register,
.logout{
  width: 50%;
  height: 48px;
  font-size: 20px;
  border-radius: 1.25rem; /* equivalent to 'xl' in Vuetify */
  /* background-color: #BBDEFB; */
  box-shadow: none;
  border: 2px solid rgba(110, 171, 217, 0.5);
}
.login:hover,
.register:hover,
.logout:hover{
  background-color: rgba(110, 171, 217,1);
  color: white;

}

/* .swiper-container .swiper-nav-wrapper .swiper-button-next,
.swiper-container .swiper-nav-wrapper .swiper-button-prev {
  margin-top: 0;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  border: 1px solid #4d4d4d;
  width: 35px;
  height: 70px;
  background-color: #000;
  -webkit-transition: .25s ease;
  transition: .25s ease;
  z-index: 2
}

.swiper-button-next,
.swiper-button-prev {
  position: absolute;
  top: 50%;
  width: calc(var(--swiper-navigation-size)/ 44 * 27);
  height: var(--swiper-navigation-size);
  margin-top: calc(0px - (var(--swiper-navigation-size)/ 2));
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--swiper-navigation-color, var(--swiper-theme-color))
} */

</style>
