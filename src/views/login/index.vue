<template>
  <div class='container'>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-cell-group>
      <van-field
        @blur="checkMobile"
        :error-message="errMsg.mobile"
        v-model="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-field
        @blur="validCode"
        :error-message="errMsg.code"
        v-model="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class='btn-box'>
      <van-button type="info" size="small" @click="login" round block>登录</van-button>
    </div>
  </div>
</template>

<script>
  import { login } from '../../api/user'
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        loginForm: {
          mobile: '13911111111',
          code: '246810'
        },
        //专门的提示信息
        errMsg: {
          mobile: '',
          code: ''
        }
      }
    },
    methods: {
      checkMobile () {
        //  判断 为空 判断格式
        if (!this.loginForm.mobile) {
          this.errMsg.mobile = '手机号不能为空'
          return false
        }
        // 判断格式
        if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
          this.errMsg.mobile = '手机格式不正确'
          return false
        }
        this.errMsg.mobile = '' // 清空信息
        return true
      },
      validCode () {
        if (!this.loginForm.code) {
          this.errMsg.code = '验证码不能为空'
          return false
        }
        if (!/^\d{6}$/.test(this.loginForm.code)) {
          this.errMsg.code = '验证码必须为6位数字'
          return false
        }
        this.errMsg.code = '' // 清空信息
        return true
      },
      ...mapMutations(['updateUser']),
      async login () {

        if (this.checkMobile() && this.validCode()) {
          const data = await login(this.loginForm)
          console.log(data)
        }
      }
    }
  }
</script>

<style scoped>
  .btn-box {
    padding: 20px;
  }
</style>
