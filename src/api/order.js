import request from '@/utils/request'

/**
 * 生成订单
 * @returns Promise
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址信息
 * @param {Object} form - 地址对象
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}

/**
 * 修改收货地址信息
 * @param {Object} form - 地址对象
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 提交订单
 * @param {Object} params - 订单信息对象
 * @returns
 */
export const submitOrder = (params) => {
  return request('/member/order', 'post', params)
}

/**
 * 获取订单详情
 * @param {String} orderId -订单ID
 * @returns
 */
export const findOrderDetail = (orderId) => {
  return request('/member/order/' + orderId, 'get')
}
