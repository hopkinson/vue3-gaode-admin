<template>
  <el-drawer
    :modal="false"
    :visible.sync="value"
    direction="btt"
    size="auto"
    title="11"
    class="track__inner"
    @input="$emit('input', value)"
  >
    <div class="track">
      <!-- 关闭 -->
      <i class="track__close el-icon-close" @click="$emit('input', false)"></i>
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
import { Component, Vue, Model } from 'vue-property-decorator'
import FormTrack from '../Form/Track.vue'
import SliderTrack from '../Slider/Track.vue'
@Component({
  name: 'DrawerTrack',
  components: {
    FormTrack,
    SliderTrack
  }
})
export default class DrawerTrack extends Vue {
  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean
}
</script>

<style lang="less" scoped>
.track {
  background: #000;
  position: relative;
  &__close {
    position: absolute;
    top: 20px;
    right: 45px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
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
    &.is-form {
      margin-left: 30px;
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
