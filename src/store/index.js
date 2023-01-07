import { createStore } from 'vuex'
import cart from './modules/cart'
import user from './modules/user'
import category from './modules/category'
import createPersistedstate from 'vuex-persistedstate'

// 2.0 创建仓库 new Vuex.Store({})
// 3.0 创建仓库 createStore({})
export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cart,
    user,
    category
  },
  plugins: [
    createPersistedstate({
      key: 'erabbit-pc-vue-store',
      paths: ['user', 'cart']
    })
  ]
})
