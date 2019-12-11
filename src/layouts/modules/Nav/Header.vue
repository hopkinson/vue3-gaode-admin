<template>
  <div class="header__container">
    <!-- 1. 左边：标题 -->
    <h1 class="header__title">{{ title }}</h1>
    <!-- 2. 中间：导航栏 -->
    <div class="header__content">
      <div class="header__menus">
        <slot></slot>
      </div>
    </div>
    <!-- 3. 右边 -->
    <div class="header__footer">
      <em>{{ current.date }}</em>
      <em>{{ current.week }}</em>
      <em>{{ current.time }}</em>
      <button-fullscreen></button-fullscreen>
      <span class="header__footer--logout" @click.native="$emit('log-out')"
        >退出</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import ButtonFullscreen from '../Button/FullScreen.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'NavHeader',
  components: {
    ButtonFullscreen
  }
})
export default class NavHeader extends Vue {
  // 标题
  @Prop({ default: '' }) readonly title!: string
  // 用户信息
  @Prop({ default: () => ({}) }) readonly userInfo!: object

  get current() {
    return {
      date: dayjs().format('YYYY-MM-DD'),
      week: dayjs()
        .locale('zh-cn')
        .format('周dd'),
      time: dayjs().format('HH:mm')
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  &__container {
    padding: 0 40px;
    background: @primary-color;
    color: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    h1 {
      font-size: 22px;
    }
  }
  &__title {
    margin-right: 124px;
  }
  &__footer {
    display: flex;
    align-items: center;
    em {
      margin-right: 15px;
      font-style: normal;
    }
    &--logout {
      border: 1px solid #fff;
      font-size: 14px;
      padding: 3px 18px;
      cursor: pointer;
    }
  }
  &__content {
    display: flex;
    align-items: center;
    flex: 1;
  }
  &__menus {
    margin-right: 50px;
  }
}
</style>
