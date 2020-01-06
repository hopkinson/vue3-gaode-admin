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
    <el-container>
      <el-aside width="270px" v-if="aside">
        <!-- <slot name="aside"></slot> -->
        <el-menu
          :default-active="$route.path"
          router
          active-text-color="#fff"
          background-color="#081328"
          text-color="#fff"
          class="index__aside"
        >
          <el-menu-item
            :index="itemRoute(item.path)"
            v-for="(item, index) in asideMenu"
            :key="index"
          >
            <i
              class="sprite_ico index__title"
              :class="`sprite_ico_${item.meta.icon}`"
            ></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 2. 主要部分 -->
      <el-main class="index__main" :style="{ background: background }">
        <!-- 2.1 面包屑 -->
        <breadcrumb-route
          class="index__main--breadcrumb"
          v-if="breadcrumb"
        ></breadcrumb-route>
        <!-- 2.2 业务页面 -->
        <div class="index__main--container" :style="{ padding: gap }">
          <router-view v-if="router"></router-view>
          <slot v-else></slot>
        </div>
      </el-main>
    </el-container>
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
import Router, { RouteConfig } from 'vue-router'
import router from '@/router'
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
  // 是否显示侧边栏
  @Prop({ type: Boolean, default: false }) readonly aside!: boolean
  // 是否显示退出
  @Prop({ type: Boolean, default: true }) readonly logout!: boolean
  // 是否显示导航菜单
  @Prop({ type: Boolean, default: true }) readonly navMenu!: boolean
  // 是否根据路由显示slot
  @Prop({ type: Boolean, default: false }) readonly router!: boolean
  // 是否显示面包屑
  @Prop({ type: Boolean, default: false }) readonly breadcrumb!: boolean

  // 背景颜色
  @Prop({ type: String, default: '#eff4f7' }) readonly background!: string

  // 背景颜色
  @Prop({ type: String, default: '24px' }) readonly gap!: string

  title: string = process.env.VUE_APP_TITLE
  copyright: string = process.env.VUE_APP_COPYRIGHT

  @Getter('user/userInfo') userInfo!: object

  @Getter('permission/addRouters') addRouters!: Array<RouteConfig>
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

  // 导航的路由
  itemRoute(path) {
    let result = ''
    const _routes = this.$route.matched
    if (_routes.length > 1) {
      result = `${_routes[1].path}/${path}`
    } else {
      result = `/${path}`
    }
    return result
  }

  // 侧边栏的菜单
  get asideMenu() {
    let result: Array<RouteConfig> = []
    const router = this.addRouters.filter(item =>
      this.$route.path.includes(item.path)
    )

    const baseRoute = router[0].children || []
    result = baseRoute[0].children || []

    return result
  }
}
</script>

<style lang="less" scoped>
.index {
  &__container {
    height: 100%;
  }
  &__aside {
    padding-top: 85px;
    border: none;
    & /deep/ .el-menu-item {
      height: 75px;
      line-height: 75px;
    }
    & /deep/ .el-menu-item.is-active {
      background-color: #0f1c36 !important;
      border: none !important;
    }
  }
  &__title {
    margin: 0 10px 0 20px;
  }
  &__header {
    padding: 0;
  }
  &__main {
    padding: 0;
    &--container {
      height: 100%;
      padding: 24px;
    }
    &--breadcrumb {
      padding: 40px 0 0 20px;
    }
  }
}
</style>
