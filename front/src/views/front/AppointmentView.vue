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
          v-model="selectedDate"
          @update:model-value="getAppointment"
          ></v-date-picker>
        </v-col>
        <v-col v-for="appointment in appointments"
        :key="appointment._id"
        :cols="getCols()">
        <v-card class="appointment-card">
          <!-- <v-img :src="image" contain height="60" /> -->
          <v-card-title>
            {{ selectedDate.toLocaleDateString() }}
            <!-- {{ new Date(date).toISOString().split('T')[0] }} -->
          </v-card-title>
          <v-card-subtitle>{{ appointment.begin + ' ~ ' + appointment.end }}</v-card-subtitle>

          <v-chip style="white-space: pre;">{{ appointment.info }}</v-chip>

          <v-card-actions class="text-center justify-center">
            <v-btn color="primary" prepend-icon="mdi-cart" class="w-100" @click="addCart">預約</v-btn>
          </v-card-actions>
        </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
// import AppointCard from '@/components/AppointCard.vue'
import gsap from 'gsap'
import { date } from 'yup'

const { api } = useApi()
const createSnackbar = useSnackbar()

const appointments = ref([])
const selectedDate = ref()

// 把頁面上的資料取出來，在onMounted的時候才可以抓到頁面上DOM元素
onMounted(async () => {
  try {
    const { data } = await api.get('/appointments/date', {
      params: {
        date: new Date().toISOString().split('T')[0]
      }
    })
    appointments.value.push(...data.result)
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

const getAppointment = async () => {
  try {
    const { data } = await api.get('/appointments/date/', {
      params: {
        date: selectedDate.value.getTime()
      }
    })
    appointments.value = data.result
    console.log(data)
  } catch (error) {
    console.log(error)
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
