<template>
    <div class="xtx-city" ref="target">
      <div class="select" @click="toggle()" :class="{active: visible}">
        <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
        <span v-else class="value">{{ fullLocation }}</span>
        <i class="iconfont icon-angle-down"></i>
      </div>
      <div class="option" v-if="visible">
        <div v-if="loading" class="loading"></div>
        <template v-else>
            <span class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{ item.name }}</span>
        </template>
      </div>
    </div>
  </template>

<script>
// 父组件设置省市区的code数据，对应的文字数据，定义一个默认的数据，当用户有登陆则获取用户的默认地址，传到XtxCity组件里显示出来，
// 监听XtxCity的点击事件，分别判断选择的省市区的数据是哪一个并用一个空数据记录下来，给计算属性使用，这样就能知道是点了哪个城市
// 在点击到最后一级时，把数据再传回父组件使用显示出来，形成闭环
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
import { ref, computed, reactive } from 'vue'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      defalut: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const allCityData = ref([])
    const loading = ref(false)
    const open = () => {
      visible.value = true
      loading.value = true
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
      // 每次打开地区选择前都清空一次
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    const toggle = () => {
      visible.value ? close() : open()
    }
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 计算属性， 获取当前显示的地区数据
    const currList = computed(() => {
    // 默认省一级
      let list = allCityData.value
      // 市
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 区
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })

    // 选择的省市区数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 点击地区选择时记录下来
    const changeItem = (item) => {
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        emit('change', changeResult)
      }
    }

    return { visible, toggle, target, loading, currList, changeItem }
  }
}

// 获取地区数据函数
const getCityData = () => {
  // https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  return new Promise((resolve, reject) => {
    // 约定：数据存储在window的cityData字段
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
