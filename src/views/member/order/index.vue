<template>
  <div class="member-order">
    <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
      @on-confirm="handleConfirm"
      @on-cancel="handleCancel"
      @on-delete="handleDelete"
      @on-logistics="handleLogistics"
      v-for="item in orderList"
      :key="item.id"
      :order="item"></OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination v-if="total > 0"
      :current-page="reqParams.page"
      :page-size="reqParams.pageSize"
      :total="total"
      @current-change="reqParams.page=$event"
      ></XtxPagination>
      <!-- 取消原因 -->
      <OrderCancel ref="orderCancelCom"></OrderCancel>
      <!-- 查看物流 -->
      <OrderLogistics ref="OrderLogisticsCom"></OrderLogistics>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import OrderLogistics from './components/order-logistics.vue'
import confirm from '@/components/library/confirm'
import Message from '@/components/library/Message'

export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    // 获取订单数据
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    // 筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      orderState: 0
    })

    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    // 点击选项卡
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }

    // 删除订单
    const handleDelete = (order) => {
      confirm({ text: '确认删除订单吗？' }).then(() => {
        deleteOrder(order.id).then(() => {
          Message({ type: 'success', text: '删除成功' })
          getOrderList()
        })
      }).catch(() => {})
    }

    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      handleDelete,
      ...useConfirm(),
      ...useCancel(),
      ...useLogistics()
    }
  }
}

// 取消订单逻辑
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  const handleCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handleCancel, orderCancelCom }
}

// 确认收货逻辑
export const useConfirm = () => {
  const handleConfirm = (order) => {
    confirm({ text: '确认收货吗？确认后货款将打给买家' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '收货成功' })
        // 待收货 -> 待评价
        order.orderState = 4
      })
    }).catch(() => {})
  }
  return { handleConfirm }
}

// 查看物流
export const useLogistics = () => {
  const OrderLogisticsCom = ref(null)
  const handleLogistics = (order) => {
    OrderLogisticsCom.value.open(order)
  }
  return { handleLogistics, OrderLogisticsCom }
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}

.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 300px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}

</style>
