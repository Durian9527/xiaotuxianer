import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入自定义UI
import UI from '@/components/library'
import 'normalize.css'
import '@/assets/style/common.less'

createApp(App).use(store).use(router).use(UI).mount('#app')
