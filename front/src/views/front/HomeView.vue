<template>
<div class="context">
  <swiper
    :spaceBetween="30"
    :effect="'fade'"
    :navigation="true"
    :modules="modules"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    class="mySwiper"
  >
  <swiper-slide>
      <div class="overlay"></div>
      <video src="../../assets/video/volley_video_02.mp4" class="d-block" autoplay muted loop></video>
    </swiper-slide>
    <swiper-slide>
      <video src="../../assets/video/volley_video_01.mp4" class="d-block" autoplay muted loop></video>
    </swiper-slide>
    <swiper-slide>
      <video src="../../assets/video/volley_video_03.mp4" class="d-block" autoplay muted loop></video>
    </swiper-slide>
    <!-- <div class="swiper-slide">
        <div class="swiper-image swiper-image01"></div>
        <div class="overlay"></div>
    </div> -->

  </swiper>
</div>

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
.context  {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* position: relative; */
  /* bottom: 0; */
}

.mySwiper {
  /* height: calc(100vh - 64px); */
  height:100vh;
  /* transform: translateY(-64px); */
  /* background: linear-gradient(to top, rgba(23, 9, 7, 0) 0%, rgb(23, 9, 7) 100%); */
  /* transform: translateY(-64px); */
}

.swiper-slide video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(.8);
    }

.overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: transparent;
  opacity: .4;
  background-image: radial-gradient(#000 20%, transparent 10%), radial-gradient(#000 20%, transparent 10%);
  background-size: 3px 3px;
  background-position: 0 0, 1.5px 1.5px;
  background-repeat: repeat;
}

.mySwiper .swiper-button-next,
.mySwiper .swiper-button-prev {
  position: absolute;
  top: 50%;
  width: 35px; /* 設置您想要的寬度 */
  height: 70px; /* 設置您想要的高度 */
  margin-top: -35px; /* 負值的一半，使按鈕置中 */
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red; /* 按鈕文字顏色 */
  background-color: #000000; /* 按鈕背景顏色 */
  border: 1px solid #4d4d4d; /* 選擇性：按鈕邊框 */
  transition: .25s ease; /* 選擇性：按鈕過渡效果 */
}

.swiper-button-next {
  right: 10px; /* 距右邊的距離 */
}

.swiper-button-prev {
  left: 10px; /* 距左邊的距離 */
}
</style>
