<template>
  <div class="home-entry">
    <div class="container">
      <!-- 左侧 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
      <HomeBanner></HomeBanner>
    </div>
  </div>
  <HomeNew></HomeNew>
  <HomeHot></HomeHot>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'

export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot
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
