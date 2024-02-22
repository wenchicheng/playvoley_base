<template>
  <div class="top-block"></div>
  <div class="outline-all">
    <v-container
    class="h-100 d-flex justify-center align-center"
    :style="{ width: getContainerWidth() }">
      <v-row>
        <v-col cols="6">
          <v-date-picker
          width="100%"
          elevation="0"
          :first-day-of-week="1"
          rounded-xl
          ></v-date-picker>
        </v-col>
        <v-col v-for="appointment in appointments"
        :key="appointment._id"
        :cols="getCols()">
        <AppointCard v-bind="appointment" />
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import AppointCard from '@/components/AppointCard.vue'
import gsap from 'gsap'

const { api } = useApi()
const createSnackbar = useSnackbar()

const appointments = ref([])

// 把頁面上的資料取出來，在onMounted的時候才可以抓到頁面上DOM元素
onMounted(async () => {
  try {
    const { data } = await api.get('/appointments', {
      params: {
        // 預設20筆資料，-1是全部
        itemsPerPage: -1
      }
    })
    appointments.value.push(...data.result.data)
    await nextTick()
    // 用 GSAP 動畫----------------------------------------
    gsap
      .to('.appointment-card', { opacity: 1, duration: 0.5 })
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

// 設定container的寬度
const getContainerWidth = () => {
  const screenWidth = window.innerWidth
  if (screenWidth >= 1200) {
    return '70%'
  } else if (screenWidth >= 960) {
    return '80%'
  } else if (screenWidth >= 600) {
    return '85%'
  } else {
    return '90%'
  }
}

const getCols = () => {
  const screenWidth = window.innerWidth
  if (screenWidth >= 1200) {
    return 4 // xl
  } else if (screenWidth >= 960) {
    return 3 // lg
  } else if (screenWidth >= 600) {
    return 6 // md
  } else {
    return 12 // sm
  }
}
</script>

<style scoped>
.outline-all * {
  outline: 1px solid #e06969;
}
.top-block{
width: 100%;
height: 64px;
/* background-color: #fff; */
}
</style>
