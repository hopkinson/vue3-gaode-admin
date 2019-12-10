<template>
  <div class="menu__container">
    <el-menu
      :default-active="active"
      background-color="#3c6bd9"
      text-color="#fff"
      active-text-color="#e6a23c"
      mode="horizontal"
      router
    >
      <el-menu-item
        :index="item.path"
        v-for="(item, index) in data"
        :key="index"
      >
        <i class="menu__container--icon" :class="item.meta.icon"></i>
        <span slot="title" class="menu__title">{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'

@Component({
  name: 'NavMenu'
})
export default class NavMenu extends Vue {
  // 标题
  @Prop({ default: () => [] }) readonly data!: Array<Route>
  // 激活的路由
  active: string = ''
  @Watch('$route', { immediate: true })
  public handleChangeRoute(val: Route) {
    if (val) {
      this.active = val.matched[0].path
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu--horizontal {
  border: none;
}
.menu {
  &__container {
    &--icon {
      color: #fff;
      font-size: 20px;
      margin-right: 2px;
    }
  }
}
</style>
