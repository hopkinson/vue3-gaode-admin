<template>
  <el-container class="index__container">
    <!-- 1. 头部 -->
    <el-header class="index__header" height="60px">
      <nav-header
        :title="title"
        :userInfo="userInfo"
        @log-out="handleLogout"
        :logout="logout"
        @update="handleUpdateUserInfo"
      >
        <nav-menu :data="addRouters" v-if="navMenu"></nav-menu>
      </nav-header>
    </el-header>
    <!-- 2. 主要部分 -->
    <el-main class="index__main">
      <!-- 2.1 面包屑 -->
      <breadcrumb-route
        class="index__main--breadcrumb"
        v-if="breadcrumb"
      ></breadcrumb-route>
      <!-- 2.2 业务页面 -->
      <div class="index__main--container">
        <router-view v-if="router"></router-view>
        <slot v-else></slot>
      </div>
    </el-main>
    <!-- 尾部 -->
    <el-footer height="40px" v-if="footer">
      <footer-copyright :data="copyright"></footer-copyright>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import NavHeader from './modules/Nav/Header.vue'
import NavMenu from './modules/Nav/Menu.vue'
import FooterCopyright from './modules/Footer/Copyright.vue'
import BreadcrumbRoute from './modules/Breadcrumb/Route.vue'
@Component({
  name: 'Layout',
  components: {
    NavHeader,
    NavMenu,
    FooterCopyright,
    BreadcrumbRoute
  }
})
export default class Layout extends Vue {
  // 是否显示底部
  @Prop({ type: Boolean, default: false }) readonly footer!: boolean
  // 是否显示退出
  @Prop({ type: Boolean, default: true }) readonly logout!: boolean
  // 是否显示导航菜单
  @Prop({ type: Boolean, default: false }) readonly navMenu!: boolean
  // 是否根据路由显示slot
  @Prop({ type: Boolean, default: false }) readonly router!: boolean
  // 是否显示面包屑
  @Prop({ type: Boolean, default: false }) readonly breadcrumb!: boolean
  title: string = process.env.VUE_APP_TITLE
  copyright: string = process.env.VUE_APP_COPYRIGHT
  @Getter('user/userInfo') userInfo!: object
  @Getter('permission/addRouters') addRouters!: string
  // 退出登录
  handleLogout() {
    this.$store.dispatch('user/Logout').then(() => {
      window.location.href = ''
    })
  }
  // 更新用户信息
  handleUpdateUserInfo() {
    this.$router.push({
      path: '/user/index'
    })
  }
}
</script>

<style lang="less" scoped>
.index {
  &__container {
    height: 100%;
  }
  &__header {
    padding: 0;
  }
  &__main {
    padding: 0;
    background: #333;
    &--container {
      height: 100%;
      // padding: 20px;
    }
    &--breadcrumb {
      padding: 20px 0 0 20px;
    }
  }
}
</style>
