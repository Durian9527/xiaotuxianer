import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入自定义UI
import UI from '@/components/library'
// 重置样式的库
import 'normalize.css'
// 自己项目的重置样式和公用样式
import '@/assets/style/common.less'
// mockjs
import './mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
