import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'

import dayjs from 'dayjs'

/**
 * 数据懒加载
 * @param {Element} target -DOM对象
 * @param {Function} apiFn -API函数
 */
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // 停止观察
  const { stop } = useIntersectionObserver(
    target,
    // isIntersecting 是否进入可视区
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 一旦进入可视区内，停止观察
        stop()
        // 停止观察，调用api方法获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    {
      threshold: 0
    }
  )
  return { target, result }
}

/**
 * 支付倒计时
 * @param {Integer} countdown -倒计时秒数
 */
export const usePayTime = () => {
// 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })
  const start = (countdown) => {
    // countdown 倒计时秒数
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText }
}
