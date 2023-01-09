<template>
  <div class="home-entry">
    <div class="container">
      <!-- 左侧 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
      <HomeBanner></HomeBanner>
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'

export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner
  },
  setup () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.container {
  .hoverShadow();
  color: @xtxColor
}
</style>
