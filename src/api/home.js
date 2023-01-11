// 首页相关API
import request from '@/utils/request'

/**
 * 获取品牌
 * @param {Integer} limit - 品牌个数
 * @returns Promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
/**
 * 获取广告区域
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 *
 * 首页新鲜好物
 * @returns Promise
 */
export const findNew = () => {
  return request('/home/new', 'get')
}
/**
 *
 * 首页人气推荐
 * @returns Promise
 */
export const findHot = () => {
  return request('/home/hot', 'get')
}
/**
 *
 * 首页商品区块
 * @returns Promise
 */
export const findGoods = () => {
  return request('/home/goods', 'get')
}
/**
 *
 * 首页最新专题
 * @returns Promise
 */
export const findSpecial = () => {
  return request('/home/special', 'get')
}
