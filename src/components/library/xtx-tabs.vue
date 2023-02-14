<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'

export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },

  setup (props, { emit }) {
    // 接收v-model的值，且使用useVModel函数将modelValue转化为响应式数据
    const activeName = useVModel(props, 'modelValue', emit)
    // 给每个panel传值
    provide('activeName', activeName)
    // 点击选项卡时触发
    const tabClick = (name, index) => {
      activeName.value = name
      // 提供一个tab-click自定义事件
      emit('tab-click', { name, index })
    }
    return { activeName, tabClick }
  },

  // return的内容会进行渲染, return什么就渲染什么
  render () {
    // 获取默认插槽内容 -> panels
    const panels = this.$slots.default()
    console.log(panels)

    // 动静态的panels组件集合在一起
    const dynamicPanels = []
    panels.forEach(item => {
      // 静态
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item)
      } else {
        // 动态
        item.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })

    // tabs组件大容器
    // 选项卡的导航菜单结构
    // 内容容器
    const nav = <nav>
        {
          // 选项卡
          dynamicPanels.map((item, i) => {
            return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;">{item.props.label}</a>
          })
        }
    </nav>

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
