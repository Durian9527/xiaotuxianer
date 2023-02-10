import XtxConfirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'
// 2. 创建DOM容器，createVNode创建VNode节点
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)
export default ({ title, text }) => {
  // 1. 导入被创建的组件
  // 3. 使用render将VNode节点渲染到容器里
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vn = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  })
}
