<template>
<v-container class="h-100 d-flex justify-center align-center" style="width: 70%;">
  <v-row>
    <!-- <h1>ShopView</h1> -->
  </v-row>
  <v-row>
    <v-col v-for="product in products" :key="product._id" cols="12" md="6" lg="3">
    <ProductCard v-bind="product" class="mb-4 mb-4 ml-2 mr-2" />
    </v-col>
  </v-row>
</v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/ProductCard.vue'
import gsap from 'gsap'

const { api } = useApi()
const createSnackbar = useSnackbar()

const products = ref([])

// 把頁面上的資料取出來，在onMounted的時候才可以抓到頁面上DOM元素
onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        // 預設20筆資料，-1是全部
        itemsPerPage: -1
      }
    })
    products.value.push(...data.result.data)
    await nextTick()
    // 用 GSAP 動畫----------------------------------------
    gsap
      .to('.product-card', { opacity: 1, duration: 0.5 })
  } catch (error) {
    console.log(error)
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
})
</script>
