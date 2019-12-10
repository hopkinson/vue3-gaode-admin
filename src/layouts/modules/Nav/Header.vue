<template>
  <div class="header__container">
    <!-- 1. 左边：标题 -->
    <h1 class="header__title">{{ title }}</h1>
    <!-- 2. 右边：用户信息 -->
    <div class="header__content">
      <div class="header__menus">
        <slot></slot>
      </div>
      <!-- 2.1 下拉菜单 -->
      <el-dropdown>
        <div class="header__dropmenu">
          <el-image class="header__avatar" :src="userInfo.avatar">
            <i class="el-icon-user" slot="error"></i>
          </el-image>
          <span class="header__dropmenu--name">{{ userInfo.name }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$emit('log-out')"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'NavHeader'
})
export default class NavHeader extends Vue {
  // 标题
  @Prop({ default: '' }) readonly title!: string
  // 用户信息
  @Prop({ default: () => ({}) }) readonly userInfo!: object
}
</script>

<style lang="less" scoped>
.header {
  &__container {
    padding: 0 30px;
    background: @primary-color;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 20px;
      margin: 0;
    }
  }
  &__content {
    display: flex;
    align-items: center;
  }
  &__menus {
    margin-right: 50px;
  }
  &__avatar {
    border-radius: 50%;
    overflow: hidden;
    .img-thumb(40px, 40px);
    font-size: 20px;
  }
  &__dropmenu {
    display: flex;
    justify-content: center;
    align-items: center;
    &--name {
      color: #fff;
      padding: 0 10px;
      i {
        color: #fff;
      }
    }
  }
}
</style>
