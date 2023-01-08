// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类
  mutations: {
    // 拿到的所有分类集合
    setList (state, payload) {
      state.list = payload
    },
    // 找到当前鼠标经过的当前项，设置open为true，显示数据
    show (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList ({ commit }) {
      const data = await findAllCategory()
      // 给每个一级分类加上控制二级分类显示和隐藏的数据
      data.result.forEach(top => {
        top.open = false
      })
      commit('setList', data.result)
    }
  }
}
