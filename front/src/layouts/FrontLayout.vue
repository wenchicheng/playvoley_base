<template>
<!-- 手機版側欄 -->
<v-navigation-drawer v-model="drawer" temporary location="right" v-if="isMobile">
    <v-list>
      <template v-for="item in navItems" :key="item.to">
        <v-list-item :to="item.to" class="d-flex align-center justify-center ">
          <!-- <v-icon>{{ item.icon }}</v-icon> -->
          <v-list-item-title class="list-title">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
  <!-- 導覽列 -->
  <v-app-bar color="#1565C0">
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
          <v-btn :to="item.to" :prepend-icon="item.icon" class="no-hover">{{ item.text }}</v-btn>
          <v-btn prepend-icon="mdi-list-status" to="/list">註冊</v-btn>
        </template>
        <v-dialog transition="dialog-top-transition" width="600">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">登入</v-btn>
          </template>
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
                <v-window-item value="login"> 登入 </v-window-item>
                <v-window-item value="register">
                  註冊
                  <RegisterComp></RegisterComp>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-dialog>
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

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機版惻欄開關
const drawer = ref(false)

// 導覽列項目
const navItems = [
  { to: '/login', text: '介紹', icon: 'mdi-account-plus' },
  { to: '/register', text: '註冊', icon: 'mdi-account-plus' },
  { to: '/login', text: '預約', icon: 'mdi-account-plus' }
]

const tab = ref('login')
// ref() 會回傳一個響應式的物件，並且會自動將 tab 的值轉換為響應式的資料，這樣當 tab 的值改變時，會自動重新渲染頁面

</script>

<style scoped>
.no-hover:hover {
  background-color: inherit !important;
}

.list-title {
  font-size: 20px;
}

</style>
