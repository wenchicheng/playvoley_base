<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item :prepend-avatar="prependAvatar" :title="user.account"></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :title="item.text"
        :prepend-icon="item.icon"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { computed } from 'vue'

const user = useUserStore()

const navItems = [
  { to: '/admin/appointments', text: '開放時段', show: user.isLogin && user.isAdmin, icon: 'mdi-clock' },
  { to: '/admin/appointorders', text: '預約管理', show: user.isLogin && user.isAdmin, icon: 'mdi-calendar-clock' },
  { to: '/admin/products', text: '商品管理', show: user.isLogin && user.isAdmin, icon: 'mdi-plus' },
  { to: '/admin/orders', text: '訂單管理', show: user.isLogin && user.isAdmin, icon: 'mdi-cart' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

const prependAvatar = computed(() => {
  return `https://source.boringavatars.com/beam/120/${user.account}?colors=4EB3DE,8DE0A6,FCF09F,F27C7C,DE528C`
})
</script>
