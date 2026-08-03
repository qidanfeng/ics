<template>
  <div class="not-found-image">
    <img src="@/assets/404_images/404.png" alt="404 Not Found">
    <p>页面不存在或无权访问</p>
    <router-link to="/" v-if="showBackButton">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    showBackButton: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.not-found-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.not-found-image img {
  max-width: 500px;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
}

.not-found-image p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}
</style>
