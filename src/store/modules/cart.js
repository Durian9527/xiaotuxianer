import { getNewCartGoods, mergeCart, findCart, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

// 购物车状态
export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
    // stock>0 isEffectivel=true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 总金额
    validAmount (state, getters) {
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      // return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 && !goods.isEffective)
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    insertCart (state, payload) {
      // payload字段
      // id skuId name attrsText picture price nowPrice selected stock count isEffective
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      // sameIndex > -1 则存在 从0开始
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原有商品
        state.list.splice(sameIndex, 1)
      }
      // 没有相同商品时直接追加
      // (有或没有都会追加)追加新商品
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart (state, goods) {
      // 拿到待修改的商品
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并成功
      ctx.commit('setCart', [])
    },
    // 修改规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        //   rootState 等同于 `store.state`，只存在于模块中 可以取到别的模块里的数据 (ctx.rootState 拿根状态，最大的store -> index.js)
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 找出旧的商品信息
          // 删除旧的商品数据
          // 原先商品的count+新的skuId
          // 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count }).then(() => {
              return findCart()
            }).then(data => {
              ctx.commit('setCart', data.result)
              resolve()
            })
          })
        } else {
          // 未登录
          // 找出旧的商品信息
          // 删除旧的商品数据
          // 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品信息
          // 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        //   rootState 等同于 `store.state`，只存在于模块中 可以取到别的模块里的数据 (ctx.rootState 拿根状态，最大的store -> index.js)
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        //   rootState 等同于 `store.state`，只存在于模块中 可以取到别的模块里的数据 (ctx.rootState 拿根状态，最大的store -> index.js)
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车
    updateCart (ctx, payload) {
      // payload -> skuId 可能有selected count
      return new Promise((resolve, reject) => {
        //   rootState 等同于 `store.state`，只存在于模块中 可以取到别的模块里的数据 (ctx.rootState 拿根状态，最大的store -> index.js)
        if (ctx.rootState.user.profile.token) {
          // 已登录
          updateCart(payload).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 删除购物车商品
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        //   rootState 等同于 `store.state`，只存在于模块中 可以取到别的模块里的数据 (ctx.rootState 拿根状态，最大的store -> index.js)
        if (ctx.rootState.user.profile.token) {
          // 已登录
          deleteCart([payload]).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 单条删除 payload -> skuId
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 加入购物车
    insertCart (ctx, payload) {
      //  根据promise的结果判断异步操作是否完毕
      return new Promise((resolve, reject) => {
        //   rootState 等同于 `store.state`，只存在于模块中 可以取到别的模块里的数据 (ctx.rootState 拿根状态，最大的store -> index.js)
        if (ctx.rootState.user.profile.token) {
        // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
        // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 同时发送多个请求(有几个商品发几次请求)，等请求成功后，一并去修改本地数据
          // Promise.all(promise数组).then((dataList) => {}) ↑
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList是成功结果的集合，promiseArr是根据state.list而来，二者数据顺序一致。可以通过索引拿到skuId
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    }
  }
}
