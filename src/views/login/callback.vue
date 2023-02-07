<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount = true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount = false" :class="{ active: !hasAccount }" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import { ref } from 'vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/Message'
export default {
  name: 'LoginCallback',
  setup () {
    const hasAccount = ref(true)
    // 1、默认已注册且已绑定
    // 通过QQ的API获取openId(也就是后台的unionId)， 然后再去登录
    // 成功 -> 登录成功
    // 失败 -> 该QQ未和小兔鲜儿进行绑定(有账号没绑定，没账号没绑定)
    // 建议总是在使用check方法并返回true的条件下，调用getMe方法

    const isBind = ref(true)
    const store = useStore()
    const router = useRouter()
    const unionId = ref(null)
    // 确认QQ是否登录
    if (QC.Login.check()) {
      // 调用getMe方法拿到openId(第三方唯一标识)
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // 请求小兔鲜儿后台做QQ登录
        userQQLogin(openId).then(data => {
          // 登录成功
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          router.push(store.state.user.redirectUrl)
          Message({ type: 'success', text: 'QQ登录成功' })
        }).catch(e => {
          // 登录失败
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  },
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}

.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;

  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;

    i {
      font-size: 22px;
      vertical-align: middle;
    }

    span {
      vertical-align: middle;
      margin-left: 4px;
    }

    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}

.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
