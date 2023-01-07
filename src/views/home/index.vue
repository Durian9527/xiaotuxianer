<template>
    <div class="container">
        HomePage
    </div>
</template>

<script>
export default {
  name: 'HomePage',
  setup () {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/mixins.less';
.container {
  .hoverShadow();
}
</style>
