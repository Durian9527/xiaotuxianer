<template>
    <div>
        <AppNavBar></AppNavBar>
        <AppHeader></AppHeader>
        <AppHeaderSticky></AppHeaderSticky>
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
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'xtx-Layout',
  components: {
    AppNavBar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
.app-body{
  min-height: 600px;
}
</style>
