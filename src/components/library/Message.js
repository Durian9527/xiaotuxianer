// 提供一个能够显示xtx-message组件的函数
// 1、直接导入使用
// import Message from 'Message.js'  Message({ type: 'error', text: '提示文字'})
// 2、挂载到vue实例原型上使用
// this.$message({ type: 'error', text: '提示文字'})

// 导入消息提示组件
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 装载提示消息组件的DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ type, text }) => {
  // 将消息提示组件编译为虚拟节点(DOM节点)
  // createVNode(组件, 属性对象(props))
  const vnode = createVNode(XtxMessage, { type, text })
  // 将虚拟节点渲染到DOM容器中
  // render(虚拟节点，DOM容器)
  render(vnode, div)
  // 3s后销毁
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 2000)
}
