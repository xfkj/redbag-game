<template lang="pug">
.form
  .title 首次提现需填写基本信息
  .item
    label(for="name") 姓名：
    input.input(type="text" id="name" placeholder="您的姓名" v-model.trim="name")
  .item
    label(for="mobile") 手机：
    input.input(type="text" id="mobile" placeholder="您的手机" v-model.trim="mobile")
    button.code-btn(@touchstart="send_code" :disabled="code_sended") {{code_sended ? '已发送...' : '发送验证码'}}
  .item
    label(for="code") 验证：
    input.input(placeholder="验证码" id="code" v-model.trim="code")
  .item
    label(for="city") 城市：
    input.input(type="text" id="city" placeholder="您的城市" v-model.trim="city")
  .item
    label(for="studio") 画室：
    input.input(type="text" id="studio" placeholder="您的画室" v-model.trim="studio")
  .btns
    button(@touchstart="$emit('close')") 取 消
    button(@touchstart="submit") 提 交
</template>

<script>
import AV from 'api/AV'

import {Toast} from 'mint-ui'

export default {
  props: ['cs'],
  data() {
    return {
      name: null,
      mobile: null,
      city: null,
      studio: null,
      code: null,
      code_sended: false
    }
  },
  methods: {
    send_code() {
      if (!/^1[34578]\d{9}$/.test(this.mobile)) {
        return Toast('请填写正确的手机格式')
      }
      AV.Cloud.requestSmsCode({
        mobilePhoneNumber: this.mobile,
        name: '非凡教育',
        op: '发红包',
        ttl: 10
      }).then(
        () => this.code_sended = true,
        (err) => Toast(err.message)
      )
    },
    submit() {
      const {name, mobile, city, studio, code} = this
      if(!name || !mobile || !city || !studio || !code) {
        return Toast('所有字段都要填哦')
      }

      if (!/^1[34578]\d{9}$/.test(this.mobile)) {
        return Toast('请填写正确的手机号')
      }

      if (!/^\d{6}$/.test(code)) {
        return Toast('请填写正确的验证码')
      }

      AV.Cloud.verifySmsCode(code, this.mobile)
      .then(() => {
          return this.cs.save({name, mobile, city, studio})
        },
        err => {throw new Error('验证码不正确,请输入正确的验证码')}
      )
      .then(() => {
          this.$emit('close')
          return Toast('保存成功！去领钱吧')
        }
      ).catch(err => Toast(err.message))
    }
  }
}
</script>

<style scoped>
.form {
  padding: 8px;
  color: goldenrod;
}
.title {
  text-align: center;
}
.item {
  font-size: 18px;
  margin: 8px auto;
}
.input {
  border-bottom: 1px solid goldenrod;
}
#mobile {
  width: 150px;
}
.code-btn {
  border: 1px solid goldenrod;
  margin-left: 4px;
}
.btns {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.btns button {
  border: 1px solid goldenrod;
  padding: 0 4px;
}
</style>

