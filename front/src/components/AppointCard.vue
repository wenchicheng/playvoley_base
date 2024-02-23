<template>
  <v-card class="appointment-card">
    <!-- <v-img :src="image" contain height="60" /> -->
    <v-card-title>
      {{ new Date(date).toISOString().split('T')[0] }}
    </v-card-title>
    <v-card-subtitle>{{ begin + ' ~ ' + end }}</v-card-subtitle>

    <v-chip style="white-space: pre;">{{ info }}</v-chip>

    <v-card-actions class="text-center justify-center">
      <v-btn color="primary" prepend-icon="mdi-cart" class="w-100" @click="addCart">預約</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// import { tr } from 'vuetify/lib/locale/index.mjs'
// import { date } from 'yup'

// import { useApi } from '@/composables/axios'
// import { useUserStore } from '@/store/user'
// import { useSnackbar } from 'vuetify-use-dialog'
// import { useRouter } from 'vue-router'

// const { apiAuth } = useApi()
// const user = useUserStore()
// const createSnackbar = useSnackbar()
// const router = useRouter()

// 定義元件有哪些可以接收的資料
// const props = defineProps(['_id', 'category', 'description', 'image', 'name', 'price', 'sell'])
const props = defineProps({
  _id: {
    type: String,
    required: true
  },
  court: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  },
  begin: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  date: {
    // type: Date,
    type: String,
    required: true
  },
  info: {
    type: Array,
    required: true
  },
  peoplenumber: {
    type: Number,
    required: true
  },
  online: {
    type: Boolean,
    default: false
  }
})

// const addCart = async () => {
//   if (!user.isLogin) {
//     router.push('/login')
//     return
//   }
//   try {
//     const { data } = await apiAuth.patch('/users/cart', {
//       appointment: props._id,
//       quantity: 1
//     })
//     user.cart = data.result
//     createSnackbar({
//       text: '新增成功',
//       showCloseButton: false,
//       snackbarProps: {
//         timeout: 2000,
//         color: 'green',
//         location: 'bottom'
//       }
//     })
//   } catch (error) {
//     const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
//     createSnackbar({
//       text,
//       showCloseButton: false,
//       snackbarProps: {
//         timeout: 2000,
//         color: 'red',
//         location: 'bottom'
//       }
//     })
//   }
// }
</script>
