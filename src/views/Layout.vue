<template>
    <div>
        <AppNavBar></AppNavBar>
        <AppHeader></AppHeader>
        <div class="app-body">
            <RouterView></RouterView>
        </div>
        <AppFooter></AppFooter>
    </div>
</template>

<script>
import AppNavBar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
  name: 'xtx-Layout',
  components: {
    AppNavBar,
    AppHeader,
    AppFooter
  }
}
</script>

<style lang="less" scoped>
.app-body{
  min-height: 600px;
}
</style>
