<template>

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
    :pagination="{
      clickable: true,
    }"
    class="mySwiper"
  >
    <swiper-slide><img src="../../assets/272666654_122129876996494_8320183482082203450_n.jpg" alt=""></swiper-slide>
    <swiper-slide><img src="../../assets/274925362_130710516138430_2173432989958928828_n.jpg" alt=""></swiper-slide>
    <swiper-slide><img src="../../assets/275502357_133759472500201_8503645104157309647_n.jpg" alt=""></swiper-slide>

  </swiper>
<v-container class="h-100 d-flex justify-center">
</v-container>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

// import required modules
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
const modules = [Navigation, Pagination, Autoplay, EffectFade]

</script>

<style scoped>
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
</style>
