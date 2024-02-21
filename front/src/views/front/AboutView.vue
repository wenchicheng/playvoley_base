<template>
  <div class="bg">
    <swiper
    :slidesPerView="1"
    :spaceBetween="30"
    :effect="'fade'"
    :navigation="true"
    :loop="true"
    :modules="modules"
    :autoplay="{
      delay: 3000,
    }"
    class="mySwiper"
  >
    <swiper-slide><img src="../../assets/272666654_122129876996494_8320183482082203450_n.jpg" alt=""></swiper-slide>
    <swiper-slide><img src="../../assets/274925362_130710516138430_2173432989958928828_n.jpg" alt=""></swiper-slide>
    <swiper-slide><img src="../../assets/275502357_133759472500201_8503645104157309647_n.jpg" alt=""></swiper-slide>

  </swiper>
  <v-container class="h-100 d-flex justify-center">
    <v-card color="basil">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold text-h2 text-basil">關於我們</h1>
      </v-card-title>

      <v-tabs v-model="tab" bg-color="transparent" color="basil" grow>
        <v-tab v-for="item in items" :key="item" :value="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item v-for="item in items" :key="item" :value="item">
          <v-card color="basil" flat>
            <v-card-text>{{ text }}</v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
  </div>

</template>

<script setup>
import { ref } from 'vue'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
const modules = [Navigation, Pagination, Autoplay, EffectFade]

// TAB
const tab = ref('場地資訊')
const items = ref([
  '場地資訊', '收費資訊', '場地時段', 'Cocktails'
])
const text = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')

</script>

<style scoped>
.bg{
  background-color: rgb(224, 236, 246);
}
.mySwiper{
  height: 500px;
  width: 100%;
}

.swiper-slide img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(1);
    }

    /* TAB */
.bg-basil {
  background-color: #FFFBE6 !important;
}
.text-basil {
  color: #356859 !important;
}
</style>
