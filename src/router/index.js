import { createRouter, createWebHashHistory } from 'vue-router'
// import Layout from '@/views/Layout'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')

const routes = [{
  path: '/',
  component: Layout,
  children: [
    { path: '/', component: Home },
    { path: '/category/:id', component: TopCategory },
    { path: '/category/sub/:id', component: SubCategory }
  ]
}]

// 2.0 new VueRouter({}) 创建路由实例
// 3.0 createRouter({}) 创建路由实例
// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
