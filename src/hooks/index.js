import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

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
