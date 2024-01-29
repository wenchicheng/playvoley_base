<template lang="pug">
//- 手機版側欄
v-navigation-drawer(v-model="drawer" temporary location="right" v-if="isMobile")
  //- v-if="isMobile" 只有在手機版時才會顯示
  v-list
    template(v-for="item in navItems" :key="item.to")
      v-list-item(:to="item.to")
        template(#prepend)
          //- #prepend 會將元件插入到 v-list-item 的 prepend 區塊中
          v-icon(:icon="item.icon")
        v-list-item-title {{ item.text }}
//- 導覽列
v-app-bar(color="#1565C0")
  v-container.d-flex.align-center
    v-btn.no-hover(to="/" :active="false")
      v-app-bar-title
        img(src="@/assets/logo-04.png" alt="一起來打排" style="height: 40px")
    v-spacer
    //- 手機板導覽列
    template(v-if="isMobile")
      v-app-bar-nav-icon(@click="drawer = true")
    //- 電腦版導覽列
    template(v-else)
      template(v-for="item in navItems" :key="item.to")
        v-btn(:to="item.to" :prepend-icon="item.icon") {{ item.text }}
    //- 綁定表達式
    //- :key  key 屬性綁定到 item.to 的值，當使用 v-for 時，每一個生成的元素都應該有一個唯一的 key
    //- :to   to 屬性綁定到 item.to 的值，當按鈕被點擊時，應用程式會導航到 item.to 指定的路由
    //- :prepend-icon="item.icon" prepend-icon 屬性綁定到 item.icon 的值，當按鈕被點擊時，會顯示 item.icon 指定的圖示
    //- {{ item.text }} 插值表達式，它會將 item.text 的值轉換為字串並插入到按鈕的內容中

    //- 頁面內容
    //- v-main
      RouterView

</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'

// 手機版判斷
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機版惻欄開關
const drawer = ref(false)

// 導覽列項目
const navItems = [
  { to: '/login', text: '一般登入', icon: 'mdi-account-plus' },
  { to: '/', text: 'Line登入', icon: 'mdi-alert-box' }
]

</script>

<style scoped>
.no-hover:hover {
  background-color: inherit !important;
}

</style>
