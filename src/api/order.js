import request from '@/utils/request'

/**
 * 生成订单 根据购物车
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

/**
 * 查询订单列表
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState = 0, page = 1, pageSize = 10 }) => {
  return request('/member/order', 'get', { orderState, page, pageSize })
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

/**
 * 删除订单
 * @param {String} orderId - 订单ID
 * @returns
 */
export const deleteOrder = (orderID) => {
  return request('/member/order', 'delete', { ids: [orderID] })
}

/**
 * 确认收货
 * @param {String} orderId - 订单ID
 * @returns
 */
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'put')
}

/**
 * 查看物流
 * @param {String} id - 订单ID
 * @returns
 */
export const logisticsOrder = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, 'get')
}

/**
 * 获取再次购买的订单结算信息
 * @param {String} id - 订单ID
 * @returns
 */
export const repurchaseOrder = (orderId) => {
  return request('/member/order/repurchase/' + orderId, 'get')
}
