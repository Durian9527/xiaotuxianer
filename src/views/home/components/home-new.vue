<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template #right>
        <XtxMore path="/"></XtxMore>
      </template>
      <Transition name="fade">
        <ul v-if="goods.length" class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="">
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeleton bg="#f0f9f4" v-else></HomeSkeleton>
      </Transition>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findNew } from '@/api/home'
import { ref } from 'vue'
export default {
  name: 'HomeNew',
  setup () {
    const goods = ref([])
    findNew().then(data => {
      goods.value = data.result
    })
    return { goods }
  },
  components: {
    HomePanel,
    HomeSkeleton
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }

    .price {
      color: @priceColor;
    }
  }
}
</style>
