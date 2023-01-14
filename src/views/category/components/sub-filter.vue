<template>
<!-- 筛选区 -->
   <div class="sub-filter" v-if="filterData && !filterLoading">
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a @click="changeBrand(item.id)" :class="{active: item.id === filterData.brands.selectedBrand}" href="javascript:;" v-for="item in filterData.brands" :key="item.id">{{ item.name }}</a>
       </div>
     </div>
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{ item.name }}：</div>
       <div class="body">
         <a @click="changeProp(item, prop.id)" :class="{active: prop.id === item.selectedAttr}" href="javascript:;" v-for="prop in item.properties" :key="prop.id">{{ prop.name }}</a>
       </div>
     </div>
   </div>
   <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目ID的变化来获取筛选函数
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      // 只有在 变化后的ID有值 且 处于二级类目路由下 才发请求获取数据
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        findSubCategoryFilter(route.params.id).then(data => {
          // 当被选中时，加上active效果，  全部->默认被选中
          // 给每一组加上一个选中的ID  // 只有ID(selectedBrands、selectedAttr)跟被选中项的ID一致时才加上active
          data.result.brands.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          data.result.saleProperties.forEach(item => {
            item.selectedAttr = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          // console.log(data.result)
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })

    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      obj.brandId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedAttr) {
          const prop = item.properties.find(prop => prop.id === item.selectedAttr)
          obj.attrs.push({ groupName: item.name, proppertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }

    // 记录当前选择的品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 记录选择的销售属性
    const changeProp = (item, propId) => {
      if (item.selectedAttr === propId) return
      item.selectedAttr = propId
      emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .xtx-skeleton {
      padding: 10px 0;
    }
  }
</style>
