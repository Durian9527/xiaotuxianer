import request from '@/utils/request'

/**
 * 账号密码登录
 * @param {String} account 用户名
 * @param {String} password 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'POST', { account, password })
}

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 手机号登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码, 默认123456
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'POST', { mobile, code })
}

/**
 * QQ登录
 * @param {String} unionId - QQ唯一标识, openId
 * @param {Interge} source - 注册来源，1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @returns Promise
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * 获取QQ绑定时的短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录-绑定账号
 * @param {String} unionId - QQ唯一标识, openId
 * @param {Interge} mobile - 手机号
 * @param {Interge} code - 短信验证码
 * @returns promise
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 校验用户名是否存在
 * @param {String} account 用户名
 * @returns Promise
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'get', { account })
}

/**
 * 获取QQ完善信息时的短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}

/**
 * QQ登录-完善信息
 * @param {String} unionId - QQ唯一标识, openId
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @param {Interge} mobile - 手机号
 * @param {Interge} code - 短信验证码
 * @returns promise
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}
