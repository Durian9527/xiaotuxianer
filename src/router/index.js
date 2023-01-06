import { createRouter, createWebHashHistory } from 'vue-router'

const routes = []

// 2.0 new VueRouter({}) 创建路由实例
// 3.0 createRouter({}) 创建路由实例
// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
