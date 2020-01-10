<template>
  <layout-defalut
    :nav="false"
    :router="false"
    :footer="false"
    :logout="false"
    :gap="0"
  >
    <div class="login">
      <div class="login--inner">
        <!-- 表单 -->
        <div class="login__form">
          <!-- 标题 -->
          <h3 class="login__form--title">系统登录</h3>
          <!-- 表单 -->
          <el-form
            :model="form"
            :rules="rules"
            ref="loginForm"
            label-position="left"
            label-width="0px"
          >
            <el-form-item prop="username">
              <el-input
                name="username"
                type="text"
                autocomplete="off"
                v-model="form.username"
                placeholder="用户名"
              />
            </el-form-item>
            <el-form-item ref="password" prop="password">
              <el-input
                autocomplete="off"
                :type="isPwdType ? 'password' : ''"
                @keyup.enter.native="handleLogin"
                v-model="form.password"
                placeholder="密码"
              >
                <span
                  slot="suffix"
                  class="login__form--showPwd login__form--svg"
                  v-show="!loading"
                  :class="isPwdType ? 'el-icon-view' : 'el-icon-baseball'"
                  @click="showPwd"
                ></span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                class="login__form--button"
                @click.native.prevent="handleLogin"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </layout-defalut>
</template>

<script lang="ts">
import { Form as ElForm, Input, FormItem } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import LayoutDefalut from '@/layouts/default.vue'
@Component({
  name: 'Login',
  components: {
    LayoutDefalut
  }
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
.login {
  background: @login-bg-color url('/bg/login.png') no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  &--inner {
    margin: 0 auto;
    width: 1240px;
    height: 100%;
    position: relative;
  }
  &__container {
    width: 100%;
    opacity: 0.2;
  }
  &__form {
    position: absolute;
    top: 218px;
    right: 100px;
    background-color: #fff;
    border-radius: 2px;
    width: 318px;
    padding: 30px;
    & /deep/ .el-input__inner {
      border-radius: 2px;
    }
    &--button {
      width: 100%;
      letter-spacing: 4px;
      box-shadow: 0px 4px 11.52px 0.48px rgba(1, 73, 255, 0.2);
      border-radius: 2px;
      background-image: linear-gradient(
        0deg,
        rgb(8, 177, 255) 0%,
        rgb(4, 116, 255) 58%,
        rgb(0, 54, 255) 100%
      );
    }
    &--title {
      font-size: 22px;
      color: rgb(4, 27, 39);
      font-weight: bold;
      margin: 20px auto 30px;
      text-align: center;
      font-weight: bold;
    }
    &--svg {
      padding: 0 6px;
      vertical-align: middle;
      font-size: 20px;
      text-align: center;
      display: inline-block;
      color: #cccccc;
    }
  }
}
</style>
