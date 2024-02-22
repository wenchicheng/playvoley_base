<template>
  <v-app class="bg-color ">
    <div class="mouse">
      <div
        v-for="(circle, index) in circles"
        :key="index"
        :class="['circle', circle.size]"
        :style="{ top: circle.y + 'px', left: circle.x + 'px' }"
      ></div>
    </div>
    <router-view />

    <!-- <v-footer id="footer">
        <div class="footer-top-left">
          <a href="./index.html"><img src="./assets/footer-logo.svg" alt="footer-logo"></a>
        </div>
        <div class="footer-bottom-left">
          <span>© 2022 SD Canelés. All Rights Reserved.</span>
        </div>
    </v-footer> -->
  </v-app>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

export default {
  setup () {
    const circles = ref([])
    let mouseMoveListener

    // 初始化滑鼠效果的圓圈
    const initCircles = () => {
      const circleSizes = ['sm', 'md']
      circleSizes.forEach(size => {
        circles.value.push({
          x: 0,
          y: 0,
          size
        })
      })
    }

    // 設置滑鼠效果
    onMounted(() => {
      initCircles()
      mouseMoveListener = (event) => {
        circles.value.forEach(circle => {
          circle.x = event.clientX
          circle.y = event.clientY
        })
      }
      document.addEventListener('pointermove', mouseMoveListener)
    })

    // 移除滑鼠效果
    onUnmounted(() => {
      document.removeEventListener('pointermove', mouseMoveListener)
    })

    return { circles }
  },
  // 電子報訂閱表單
  data () {
    return {
      newsletter: '',
      newsletterRules: [
        v => !!v || '請輸入信箱',
        v => /.+@.+/.test(v) || '信箱格式錯誤'
      ]
    }
  },
  methods: {
    validationNewsletter (event) {
      // 驗證
    },
    subscribe () {
      // 訂閱邏輯
    }
  }
}
</script>

<style scoped>
.bg-color {
  background-color: rgb(224, 236, 246);
}

.mouse {
  padding: 0px;
  position: relative;
}

.circle {
  position: fixed;
  transform: translate(-50%, -50%);
  z-index:100;
  pointer-events: none;
}

.circle.sm {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 234, 1, 0.5);
}
/* footer------------------------------ */
#footer {
  width: 100%;
  margin-top: 100px;
  height: fit-content;
  background-color: #eceef1;
  /* background: linear-gradient(to bottom, rgba(23, 9, 7, 0) 0%, rgb(23, 9, 7) 100%); */
}

.footer-box {
  display: flex;
  flex-direction: column;
  padding: 0 100px;
}

.footer-top {
border-bottom: 1px solid #FFBE17;
}

.footer-top-left a {
  display: block;
  text-decoration: none;
  width: 100px;
  height: 100px;
}

.footer-top-left a img {
  width: 100%;
  animation: footer-logo 30s linear infinite;
}

@keyframes footer-logo {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
}
</style>
