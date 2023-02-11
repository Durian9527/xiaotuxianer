<template>
    <XtxDialog :title="`${formData.id ? '修改' : '添加'}收货地址`" v-model:visible="visibleDialog">
      <div class="address-edit">
        <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCity :fullLocation="formData.fullLocation" @change="changeCity" placeholder="请选择所在地区"/>
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="formData.address"  class="input" placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input v-model="formData.postalCode"  class="input" placeholder="请输入邮政编码" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input v-model="formData.addressTags"  class="input" placeholder="请输入地址标签，逗号分隔" />
        </div>
      </div>
    </div>
      </div>
      <template #footer>
        <XtxButton @click="visibleDialog = false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="submit()" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
  </template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const visibleDialog = ref(false)
    // 打开函数
    const open = (address) => {
      visibleDialog.value = true
      if (address.id) {
        // 修改 填充表单(已选择的地址)
        for (const key in address) {
          formData[key] = address[key]
        }
      } else {
        // 添加-> 清空之前的数据
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = null
          }
        }
      }
    }
    // 表单数据对象
    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      // 城市组价显示文字
      fullLocation: null
    })

    // 城市选中
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode
      formData.cityCode = result.cityCode
      formData.countyCode = result.countyCode
      formData.fullLocation = result.fullLocation
    }

    // 提交(修改)
    const submit = () => {
      if (formData.id) {
        // 修改
        editAddress(formData).then(data => {
          Message({ type: 'success', text: '修改成功' })
          visibleDialog.value = false
          emit('on-success', formData)
        })
      } else {
        // 添加
        addAddress(formData).then((data) => {
          formData.id = data.result.id
          Message({ type: 'success', text: '添加成功' })
          visibleDialog.value = false
          emit('on-success', formData)
        })
      }
    }

    return { visibleDialog, open, formData, changeCity, submit }
  }
}
</script>
  <style scoped lang="less">
  .address-edit {
    .xtx-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
  }
  </style>
