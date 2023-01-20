<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)"
            v-if="val.picture" :src="val.picture" :title="val.name">
          <span :class="{ selected: val.selected, disabled: val.disabled }" @click="changeSku(item, val)"
            v-else>{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import bwPowerSet from '@/vender/power-set'
const spliter = '★'
const getPathMap = (skus) => {
  // 从props.goods.skus中得到所有的sku集合
  // 从集合里筛选出有效的sku
  // 根据有效的sku使用power-set算法得到子集
  // 根据子集往路径字典对象中存储key-value

  // 创建路径字典，根据路径字典来获取商品的状态
  const pathMap = {}
  skus.forEach(sku => {
    // 如果有库存(有库存是有效sku)
    if (sku.inventory > 0) {
      // 可选值数组(每一个规格选项组成的数组)
      const valueArr = sku.specs.map(val => val.valueName)
      // 得到子集
      const valueArrPowerSet = bwPowerSet(valueArr)
      // 根据arr得到字符串的key
      valueArrPowerSet.forEach(arr => {
        // 路径字典是一个对象
        // 数组转换成字符串，约定使用五角星将两个字符串拼接
        // key是values的name
        const key = arr.join(spliter)
        // 如果字典里有 则追加进去 如果没有则设置一个
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}

// 在初始化时与点击按钮时都要去更新其他按钮的禁用状态
// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 每一个按钮的状态都有本身的disabled数据来控制
  specs.forEach((item, index) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 如果字典中有数据则启用，无则禁用
      // 2。判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3。拿当前的值按照顺序套入选中的值数组
      selectedValues[index] = val.name
      // 4.剔除undefined数据，按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter)
      // 5。拿着key去路径字典中查找是否有数据，有可以点击，没有就禁用 (true)
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 遍历每一个按钮，按钮的值与sku记录的值相同，则选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化时更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // console.log(pathMap)
    const changeSku = (item, val) => {
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮时更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将选择的sku信息通知父组件：选择了完整的sku组合按钮，才能拿到信息，提交父组件；选择了不完整的，提交空对象
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, '').trim()
        })
      } else {
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: @xtxColor;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      >img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }

      >span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
