<template>
  <div class="login">
    <!-- 表单 -->
    <div class="login__form">
      <!-- 标题 -->
      <h3 class="login__form--title">{{ title }}</h3>
      <!-- 表单 -->
      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
        label-position="left"
        label-width="0px"
      >
        <el-form-item prop="username">
          <span class="login__form--svg el-icon-user"></span>
          <el-input
            name="username"
            type="text"
            autocomplete="off"
            v-model="form.username"
            placeholder="账号"
          />
        </el-form-item>
        <el-form-item ref="password" prop="password">
          <span class="login__form--svg el-icon-key"></span>
          <el-input
            autocomplete="off"
            :type="isPwdType ? 'password' : ''"
            @keyup.enter.native="handleLogin"
            v-model="form.password"
            placeholder="密码"
          ></el-input>
          <span
            class="login__form--showPwd login__form--svg"
            v-show="!loading"
            :class="isPwdType ? 'el-icon-view' : 'el-icon-baseball'"
            @click="showPwd"
          ></span>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login__form--button"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Form as ElForm, Input, FormItem } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'Login',
  components: {}
})
export default class Login extends Vue {
  title = process.env.VUE_APP_TITLE
  // 表单数据
  form = {
    username: '',
    password: ''
  }
  // 表单规则
  rules = {
    username: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入账号'
      }
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入密码'
      }
    ]
  }
  // 加载中
  loading: Boolean = false
  // 密码类型 - 密码显示 / 隐藏
  isPwdType: Boolean = true
  // 切换显示密码
  showPwd() {
    this.isPwdType = !this.isPwdType
  }
  // 去往主页
  handleGotoredirect() {
    const { redirect } = this.$route.query
    const redirectUrl = decodeURIComponent((redirect as string) || '/')
    this.$router.push({
      path: redirectUrl
    })
  }
  /**
   * 登录处理
   * 1.密码加密
   * 2.登录
   * 3.去往redirect的页面
   * 4.处理完之后清除密码输入框的内容
   * @return {[type]} [description]
   */
  async handleLogin() {
    const loginForm = this.$refs.loginForm as ElForm
    const password = this.$refs.password as FormItem
    loginForm.validate(async (valid: boolean) => {
      if (valid) {
        this.isPwdType = true // 强制转换password模式 以免用户看到加密的密码
        this.loading = true
        try {
          // this.loginForm.password = this.PWD.encrypt(this.Form.password)
          await this.$store.dispatch('user/Login', this.form)
          password.resetField() // 清空密码
          await this.handleGotoredirect() // 跳转页面
        } catch (err) {
          password.resetField()
        }
        this.loading = false
      }
    })
  }
}
</script>

<style lang="less" scoped>
@login-bg-color: rgb(48, 65, 86);
@login-form-bg-color: rgb(72, 87, 106);
.login {
  height: 100vh;
  overflow: hidden;
  background-color: @login-bg-color;
  & /deep/ .el-input {
    width: 75%;
  }
  & /deep/ .el-input {
    width: 75%;
    .el-input__inner {
      background: transparent;
      border: 0;
      appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
    }
  }
  & /deep/ .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  &__container {
    width: 100%;
    opacity: 0.2;
  }
  &__form {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: @login-form-bg-color;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    width: 350px;
    padding: 35px 35px 15px;
    &--button {
      width: 100%;
      letter-spacing: 4px;
    }
    &--title {
      font-size: 26px;
      font-weight: 400;
      color: #f9f9f9;
      margin: 0 auto 40px;
      text-align: center;
      font-weight: bold;
    }
    &--svg {
      padding: 0 6px;
      vertical-align: middle;
      font-size: 20px;
      text-align: center;
      display: inline-block;
      color: #f9f9f9;
    }
  }
}
</style>
