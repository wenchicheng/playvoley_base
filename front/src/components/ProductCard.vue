<template>
  <v-card class="product-card">
    <v-img :src="image" contain height="240" />
    <v-card-title>
      <router-link
      class="text-primary text-decoration-none"
      :to="'/products/' + _id">{{ name }}
      </router-link>
    </v-card-title>
    <v-card-subtitle>${{ price }}</v-card-subtitle>
    <!-- <v-card-text style="white-space: pre;">{{ description }}</v-card-text> -->
    <v-card-actions class="text-center justify-center">
      <v-btn color="primary" prepend-icon="mdi-cart" class="w-100" @click="addCart">加入購物車</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/store/user'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { apiAuth } = useApi()
const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()

// 定義元件有哪些可以接收的資料
// const props = defineProps(['_id', 'category', 'description', 'image', 'name', 'price', 'sell'])
const props = defineProps({
  _id: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sell: {
    type: Boolean,
    default: false
  }
})

// 加入購物車=======================================
const addCart = async () => {
  if (!user.isLogin) {
    router.push('/shop')
    return
  }
  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product: props._id,
      quantity: 1
    })
    user.cart = data.result
    createSnackbar({
      text: '已放入購物車',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
}
</script>
