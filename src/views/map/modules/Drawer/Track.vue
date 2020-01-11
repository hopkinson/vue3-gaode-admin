<template>
  <el-drawer
    :modal="false"
    :visible.sync="visible"
    :modal-append-to-body="false"
    :wrapperClosable="false"
    direction="btt"
    size="auto"
    title="11"
    class="track__inner"
  >
    <div class="track">
      <!-- 关闭 -->
      <i class="track__icon is-close el-icon-close" @click="close"></i>
      <span
        class="track__icon is-back"
        v-show="isShowBack"
        @click="$router.back()"
      >
        <i class="el-icon-back"></i>
        <span>返回上一页</span>
      </span>
      <!-- 表单 -->
      <div class="track__item is-form">
        <form-track v-bind="$attrs" v-on="$listeners"></form-track>
      </div>

      <div class="track__item">
        <slider-track
          v-bind="$attrs"
          ref="slider"
          v-on="$listeners"
        ></slider-track>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, PropSync } from 'vue-property-decorator'
import FormTrack from '../Form/Track.vue'
import SliderTrack from '../Slider/Track.vue'
import { CarIdBody } from '@/services'
import { Getter, Mutation } from 'vuex-class'

const QUERY = 'abnormal_query'
@Component({
  name: 'DrawerTrack',
  components: {
    FormTrack,
    SliderTrack
  }
})
export default class DrawerTrack extends Vue {
  @Mutation('map/IS_SHOW_DRAWER') isShowDrawer // 方法 - 显示抽屉的状态

  @Getter('map/showDrawer') showDrawer!: boolean // 是否显示底部抽屉（轨迹）

  // 是否播放中
  visible = false

  isShowBack = false

  created() {
    this.isShowBack = !!sessionStorage['ALARMID']
  }

  beforeDestroy() {
    this.isShowBack = false
  }

  // 关闭
  close() {
    this.visible = false
    this.isShowBack = false
  }

  // 监听 - params
  @Watch('showDrawer', {})
  public watchValue(val: boolean) {
    this.visible = val
  }

  // 监听 - params
  @Watch('visible', {})
  public watchVisible(val: boolean) {
    this.isShowDrawer(val)
  }
}
</script>

<style lang="less" scoped>
.track {
  background: #000;
  position: relative;
  &__icon {
    &.is-close,
    &.is-back {
      position: absolute;
      top: 20px;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      z-index: 1;
      line-height: 1;
    }
    &.is-close {
      right: 45px;
    }
    &.is-back {
      right: 100px;
      display: inline-flex;
      align-items: center;
      span {
        font-size: 14px;
      }
    }
  }
  &__inner {
    & /deep/ .el-drawer__header {
      margin: 0;
      padding: 0;
      background: #000;
    }
    & /deep/ .el-drawer__close-btn,
    & /deep/ span[role*='heading'] {
      font-size: 0;
    }
  }
  &__item {
    height: 60px;
    display: flex;
    align-items: center;
    border-top: 1px solid #1a1a1b;
    color: #fff;
    position: relative;
    &.is-form {
      margin-left: 30px;
    }
    &.is-disabled:after {
      opacity: 0.2;
    }
    & /deep/ .el-form-item__label {
      color: #fff;
    }
    & /deep/ .el-form--inline .el-form-item {
      margin-bottom: 0 !important;
      margin-right: 40px;
    }
  }
}
</style>
