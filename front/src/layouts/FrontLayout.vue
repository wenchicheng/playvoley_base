<template>
  <v-navigation-drawer
  v-model="drawer"
  temporary location="right">
    <div class="drawer-btn-box">
      <v-btn @click="drawer = false" class="close-btn" icon="mdi-close" size="large"></v-btn>
    </div>
    <v-list class="v-list-centered">
      <template v-for="item in navItems" :key="item.to">
        <v-list-item :to="item.to" class="d-flex align-center justify-center" v-if="item.show">
          <v-list-item-title class="list-title">
            {{ item.text }}
            <!-- <v-icon v-if="item.to === '/cart'" class="cart-icon">mdi-cart</v-icon> -->
            <v-badge :content="user.cart" color="rgb(26, 108, 163)" v-if="item.to === '/cart'" inline class="badge"></v-badge>
          </v-list-item-title>
        </v-list-item>
      </template>
      <div class="d-flex justify-center mt-2 mb-4">
        <v-btn v-if="!user.isLogin"
        class="d-flex align-center justify-center login">登入
          <v-dialog
          activator="parent"
          v-model="dialog"
          transition="dialog-top-transition"
          width="600">
            <v-card>
            <v-tabs
              v-model="tab"
              color="rgb(26, 108, 163)"
              class="list-title"
              fixed-tabs>
              <v-tab value="login">登入</v-tab>
              <v-tab value="register">註冊</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="tab">
                <v-window-item value="login">
                  <LoginComp></LoginComp>
                  <!-- <v-btn color="blue-grey-lighten-4" @click="dialog = false" class="w-100">關閉</v-btn> -->
                </v-window-item>
                <v-window-item value="register">
                  <RegisterComp></RegisterComp>
                  <!-- <v-btn color="blue-grey-lighten-4" @click="dialog = false" class="w-100">關閉</v-btn> -->
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
          </v-dialog>
        </v-btn>
      </div>
      <!-- <div class="d-flex justify-center mt-2 mb-4">
        <v-btn to="/register" v-if="!user.isLogin"
        class="d-flex align-center justify-center register">
        註冊
        </v-btn>
      </div> -->
      <div class="d-flex justify-center mt-2 mb-4">
        <v-btn @click="logout" v-if="user.isLogin"
        class="d-flex align-center justify-center logout">
        登出
        </v-btn>
      </div>
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
// import { useDisplay } from 'vuetify'
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
// const { mobile } = useDisplay()
// const isMobile = computed(() => mobile.value)

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
    { to: '/cart', text: '購物車', icon: 'mdi-cart', show: user.isLogin },
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

// 監聽滾動事件==================================
window.addEventListener('scroll', handleScroll)

// 在組件被卸載前，移除滾動事件監聽器
const beforeUnmount = () => {
  window.removeEventListener('scroll', handleScroll)
}

// Drawer  =================================
const drawer = ref(false)
// const drawerWidth = 500

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
.v-main::v-deep {
  /* 深度選擇器 */
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

.drawer-btn-box{
  position: relative;
}
.close-btn {
  z-index: 1000;
  color: rgba(110, 171, 217,1);
  background-color: rgb(250, 253, 255);
  box-shadow: none;
  position: absolute;
  top: 40px;
  right: 40px;
}
/* 側欄關閉按鈕位移 */
.v-toolbar__content > .v-btn:last-child {
  margin-inline-end: 40px;
}
/* 側欄 */
.v-navigation-drawer {
  width: 100vw !important;
  background-color: rgba(110, 171, 217,1);
}
/* menu 清單項目最小高度 */
.v-list-item--density-default.v-list-item--one-line {
  min-height: 80px;
  /* padding: 8px 20px; */
}
/* menu 字體大小 */
.list-title {
  font-size: 32px;
}
/* menu 清單設定 */
.v-list-item-title{
  color: white;
  font-weight: 500;
  line-height:32px ;
}

/* 垂直置中清單 */
.v-list-centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100% - 80px);
}

.login,
.register,
.logout{
  /* width: 10%; */
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

/* 活动状态的列表项 */
.v-list-item--variant-plain,
.v-list-item--variant-outlined,
.v-list-item--variant-text,
.v-list-item--variant-tonal {
    border-radius: 50%;
    background: transparent;
    color: inherit;
    /* transform: rotate(-7deg); */
}

.v-list-item--variant-outlined:active{

}

/* 購物車數量 */
.badge {
  position: absolute;
  top: 0;
  right: -6px;
  transform: scale(1.1);
}

.cart-icon{
  transform: scale(0.6);
  position: absolute;
  top: 15px;
  right: -30px;
}

</style>
