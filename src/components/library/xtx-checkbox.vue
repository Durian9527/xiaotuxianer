<template>
    <div class="xtx-checkbox" @click="changeChecked()">
        <i v-if="checked" class="iconfont icon-checked" ></i>
        <i v-else class="iconfont icon-unchecked" ></i>
        <!-- $slots.default 获取插槽分发的内容 -->
        <span v-if="$slots.default"><slot /></span>
    </div>
</template>

<script>
import { useVModel } from '@vueuse/core'

// 数据双向绑定 v-model语法糖 ---> :modelValue  +  @update:modelValue
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据， 返回的checked就是响应式数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 就是在赋值，会触发emit('update:modelvalue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      checked.value = newVal
      emit('change', newVal)
    }

    return { checked, changeChecked }
  }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
