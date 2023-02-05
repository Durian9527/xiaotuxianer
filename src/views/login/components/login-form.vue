<template>
    <div class="account-box">
      <div class="toggle">
        <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
          <i class="iconfont icon-user"></i> 使用账号登录
        </a>
        <a @click="isMsgLogin=true" href="javascript:;" v-else>
          <i class="iconfont icon-msg"></i> 使用短信登录
        </a>
      </div>
      <Form ref="target" class="form" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
        <template v-if="!isMsgLogin">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field :class="{error: errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名或手机号" />
            </div>
            <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <Field :class="{error: errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
            </div>
            <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
          </div>
        </template>
        <template v-else>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field :class="{error: errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
            </div>
            <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <Field :class="{error: errors.code}" v-model="form.code " name="code" type="text" placeholder="请输入验证码" />
              <span class="code">发送验证码</span>
            </div>
            <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
          </div>
        </template>
        <div class="form-item">
          <div class="agree">
            <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
          </div>
          <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
        </div>
        <a @click="login()" href="javascript:;" class="btn">登录</a>
      </Form>
      <div class="action">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
        <div class="url">
          <a href="javascript:;">忘记密码</a>
          <a href="javascript:;">免费注册</a>
        </div>
      </div>
    </div>
  </template>

<script>
import { ref, reactive, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    const isMsgLogin = ref(false)
    // 表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    // name属性指定的校验规则
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    const target = ref(null)
    // 重置数据 清除校验结果
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      target.value.resetForm()
    })

    // 登录时校验
    const login = async () => {
      const valid = await target.value.validate()
      console.log(valid)
    }

    return { isMsgLogin, form, schema: mySchema, target, login }
  }
}
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
