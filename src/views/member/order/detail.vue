<template>
    <div class="member-order-detail" v-if="order">
        <!-- 头部 -->
        <OrderDetailAction :order="order"></OrderDetailAction>
        <!-- 进度 -->
        <DetailSteps :order="order"></DetailSteps>
        <!-- 物流 -->
        <Suspense>
          <template #default>
            <DetailLogistics v-if="[3, 4, 5].includes(order.orderState)" :order="order"></DetailLogistics>
          </template>
          <template #fallback>
            <div class="loading">loading...</div>
          </template>
        </Suspense>
        <!-- 信息 -->
        <DetailInfo :order="order"></DetailInfo>
    </div>
</template>

<script>
import { ref } from 'vue'
import { findOrderDetail } from '@/api/order'
import { useRoute } from 'vue-router'
import OrderDetailAction from './components/detail-action.vue'
import DetailSteps from './components/detail-steps.vue'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'

export default {
  name: 'MemberDetail',
  components: {
    OrderDetailAction,
    DetailSteps,
    DetailLogistics,
    DetailInfo
  },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>

<style lang="less" scoped>
.member-order-detail{
  background: #fff;
  height: 100%;
}
.loading {
  height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;
}
</style>
