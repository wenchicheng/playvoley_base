<template>

  <swiper
    :cssMode="true"
    :navigation="true"
    :loop="true"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide>
      <video src="../../assets/video/volley_video_02.mp4" class="d-block" autoplay loop></video>
    </swiper-slide>
    <swiper-slide>
      <video src="../../assets/video/volley_video_01.mp4" class="d-block" autoplay loop></video>
    </swiper-slide>
    <swiper-slide>
      <video src="../../assets/video/volley_video_03.mp4" class="d-block" autoplay loop></video>
    </swiper-slide>
    <!-- <div class="swiper-slide">
        <div class="swiper-image swiper-image01"></div>
        <div class="overlay"></div>
    </div> -->

  </swiper>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules'
const modules = [Navigation, Pagination, Mousewheel, Keyboard, Autoplay]
</script>

<style scoped>
.mySwiper {
  height: calc(100vh - 64px);
  /* transform: translateY(-64px); */
}

.swiper-slide video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
</style>
