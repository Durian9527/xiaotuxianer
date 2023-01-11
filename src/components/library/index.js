// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'

export default {
  install (app) {
    // 在app上进行扩展，app提供component directive函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    // 定义指令
    defineDirective(app)
  }
}

// 创建观察对象实例
// const observer = new IntersectionObserver(callback[, options])
// callback 被观察dom进入可视区离开可视区都会触发
// - 两个回调参数 entries , observer
// - entries 被观察的元素信息对象的数组 [{元素信息},{}]，信息中isIntersecting判断进入或离开
// - observer 就是观察实例
// options 配置参数(可选)
// - 三个配置属性 root rootMargin threshold
// - root 基于的滚动容器，默认是document
// - rootMargin 容器有没有外边距
// - threshold 交叉的比例

// 实例提供两个方法
// observe(dom) 观察哪个dom
// unobserve(dom) 停止观察那个dom

// 自定义指令
const defineDirective = (app) => {
  // 懒加载原理：先存储图片地址，但不能在src上，当图片进入可视区，再将存储的图片地址，设置给图片元素即可
  app.directive('lazy', {
    // vue2.0 监听使用指令的DOM是否创建好，->钩子函数：inserted
    // vue3.0 的指令拥有的钩子函数 和组件的钩子函数一样，使用指令的DOM是否创建好，钩子函数：mounted
    mounted (el, binding) {
      // 创建一个观察对象，来观察当前使用指令的对象
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observe.unobserve(el)
          // 把指令的值设置给el的src属性， binding.value就是指令的值
          el.src = binding.value
          // 图片加载失败 error ; 加载成功 load
          el.onerror = () => {
            el.src = defaultImg
          }
        }
      }, {
        threshold: 0
      })
      observe.observe(el)
    }
  })
}
