<template>
  <Form ref="target" class="xtx-form" :validation-schema="mySchema" v-slot="{errors}" autocomplete="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err: errors.account}" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
        <span @click="send()" class="code">{{ time === 0 ? '发送验证码' : `${time - 1}秒后发送` }}</span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err: errors.password}" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err: errors.rePassword}" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive, onUnmounted, ref } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const form = reactive({
      account: null,
      password: null,
      mobile: null,
      code: null,
      rePassword: null
    })

    const mySchema = {
      account: schema.accountApi,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      rePassword: schema.rePassword
    }

    // useIntervalFn(回调函数， 间隔时间， 是否立即执行)
    const target = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '验证码发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败, 使用vee的错误函数来显示错误信息 - setFieldError(字段, 错误信息)
        target.value.setFieldError('mobile', valid)
      }
    }

    // 立即绑定
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = target.value.validate()
      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          // 登录成功
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            router.push(store.state.user.redirectUrl)
            Message({ type: 'success', text: '信息完善成功' })
          })
        }).catch(e => {
          Message({ type: 'error', text: '信息完善失败' })
        })
      }
    }

    return { form, mySchema, send, time, target, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;

  &:hover {
    cursor: pointer;
  }
}
</style>
