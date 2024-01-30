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
      <v-btn no-hover to="/" :active="false">
        <v-app-bar-title>
          <img src="@/assets/logo-04.png" alt="一起來打排" style="height: 40px">
        </v-app-bar-title>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- 手機板導覽列 -->
      <template v-if="isMobile">
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      </template>
      <!-- 電腦版導覽列 -->
      <template v-else>
        <template v-for="item in navItems" :key="item.to">
          <template v-if="item.text === '登入'">
            <v-btn @click="dialog = true" :to="item.to">{{ item.text }}</v-btn>
            <v-dialog v-model="dialog" width="700"></v-dialog>
          </template>
          <template v-else>
            <v-btn :to="item.to">{{ item.text }}</v-btn>
          </template>
        </template>
      </template>
    </v-container>
  </v-app-bar>

        <!-- v-btn(prepend-icon="mdi-cog" @click="dialog = true") 設定 -->
        <!-- v-dialog(v-model="dialog" width="700") -->
        <!--   v-card -->
        <!--     v-card-text -->
        <!--       SettingsView -->
        <!--     v-card-actions(class="d-flex justify-center mb-5") -->
        <!--       v-btn(color="teal" variant="flat" size="large" class="px-5" @click="dialog = false") CLOSE -->

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
import LoginView from '@/views/front/LoginView.vue'

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機版惻欄開關
const drawer = ref(false)

// 導覽列項目
const navItems = [
  { to: '/login', text: '介紹', icon: 'mdi-account-plus' },
  { to: '/login', text: '預約', icon: 'mdi-account-plus' },
  { to: '/login', text: '登入', icon: 'mdi-account-plus' }
]

</script>

<style scoped>
.no-hover:hover {
  background-color: inherit !important;
}
.list-title {
  font-size: 20px;
}

</style>
