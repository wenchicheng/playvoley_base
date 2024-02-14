<template>
<!-- 手機版側欄 -------------------------------------------------------------->
  <v-navigation-drawer v-model="drawer" temporary location="right" v-if="isMobile">
    <v-list>
      <template v-for="item in navItems" :key="item.to">
        <v-list-item :to="item.to" class="d-flex align-center justify-center" v-if="item.show">
          <v-list-item-title class="list-title">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </template>
      <v-list-item to="/login" class="d-flex align-center justify-center" v-if="!user.isLogin">
        <v-list-item-title class="list-title">登入</v-list-item-title>
      </v-list-item>
      <v-list-item to="/register" class="d-flex align-center justify-center" v-if="!user.isLogin">
        <v-list-item-title class="list-title">註冊</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout" class="d-flex align-center justify-center" v-if="user.isLogin">
        <v-list-item-title class="list-title">登出</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- 導覽列-------------------------------------------------------------- -->
  <v-app-bar class="navbar" >
    <v-container class="d-flex align-center">
      <a href="/">
        <v-app-bar-title>
          <img src="@/assets/logo-04.png" alt="一起來打排" style="height: 40px">
        </v-app-bar-title>
      </a>
      <v-spacer></v-spacer>
      <!-- 手機板導覽列 -->
      <template v-if="isMobile">
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      </template>
      <!-- 電腦版導覽列 -->
      <template v-else>
        <template v-for="item in navItems" :key="item.to">
          <v-btn :to="item.to" v-if="item.show">{{ item.text }}</v-btn>
      </template>
      <v-btn v-if="!user.isLogin">登入
        <v-dialog
        activator="parent"
        v-model="dialog"
        transition="dialog-top-transition"
        width="600">
          <v-card>
          <v-tabs
            v-model="tab"
            color="#1565C0"
            class="list-title"
            fixed-tabs>
            <v-tab value="login">登入</v-tab>
            <v-tab value="register">註冊</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="login">
                <LoginComp></LoginComp>
                <v-btn color="blue-grey-lighten-4" @click="dialog = false" class="w-100">關閉</v-btn>
              </v-window-item>
              <v-window-item value="register">
                <RegisterComp></RegisterComp>
                <v-btn color="blue-grey-lighten-4" @click="dialog = false" class="w-100">關閉</v-btn>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
        </v-dialog>
      </v-btn>
        <!-- 登出按鈕 -->
        <v-btn v-if="user.isLogin" @click="logout">登出</v-btn>
      </template>
    </v-container>
  </v-app-bar>

    <!-- 綁定表達式
    <v-btn :to="item.to" :prepend-icon="item.icon">{{ item.text }}</v-btn>
    :key  key 屬性綁定到 item.to 的值，當使用 v-for 時，每一個生成的元素都應該有一個唯一的 key
    :to   to 屬性綁定到 item.to 的值，當按鈕被點擊時，應用程式會導航到 item.to 指定的路由
    :prepend-icon="item.icon" prepend-icon 屬性綁定到 item.icon 的值，當按鈕被點擊時，會顯示 item.icon 指定的圖示
    {{ item.text }} 插值表達式，它會將 item.text 的值轉換為字串並插入到按鈕的內容中 -->

    <!-- 頁面內容 -->
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
import { useRoute } from 'vue-router'

// 對話框預設關閉
const dialog = ref(false)

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const router = useRoute()

const user = useUserStore()

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機版惻欄開關
const drawer = ref(false)

// 導覽列項目
const navItems = computed(() => {
  return [
    { to: '/about', text: '場館介紹', show: true },
    { to: '/news', text: '最新消息', show: true },
    { to: '/appointment', text: '預約報名', show: true },
    { to: '/myappointment', text: '我的預約', show: user.isLogin },
    // { to: '/cart', text: '購物車', show: user.isLogin },
    { to: '/admin', text: '管理', show: user.isLogin && user.isAdmin }
  ]
})

const tab = ref('login')
// ref() 會回傳一個響應式的物件，並且會自動將 tab 的值轉換為響應式的資料，這樣當 tab 的值改變時，會自動重新渲染頁面

const logout = async () => {
  try {
    await apiAuth.delete('/users/logout')
    user.logout()
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
.no-hover:hover {
  background-color: inherit !important;
}

.list-title {
  font-size: 20px;
}

.navbar{
  background-color: rgba(21, 101, 192, 1);
  color:white;
  font-weight: 600;
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
