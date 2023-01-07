import { createRouter, createWebHashHistory } from 'vue-router'
// import Layout from '@/views/Layout'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')

const routes = [{
  path: '/',
  component: Layout,
  children: [{
    path: '/',
    component: Home
  }]
}]

// 2.0 new VueRouter({}) 创建路由实例
// 3.0 createRouter({}) 创建路由实例
// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
