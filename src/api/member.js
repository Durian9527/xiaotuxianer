import request from '@/utils/request'

/**
 * 获取收藏分页数据
 * @param {Integer} collectType -收藏类型
 * @param {Integer} page -第几页
 * @param {Integer} pageSize -一页几条
 * @returns
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
