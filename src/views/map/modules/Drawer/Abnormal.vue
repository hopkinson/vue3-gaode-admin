<template>
  <el-drawer
    :modal="false"
    :visible.sync="visible"
    :modal-append-to-body="false"
    :wrapperClosable="false"
    direction="rtl"
    size="auto"
    title="11"
    class="track__inner"
  >
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, PropSync } from 'vue-property-decorator'
@Component({
  name: 'DrawerTrack',
  components: {}
})
export default class DrawerTrack extends Vue {
  // 是否正在播放 .sync
  @PropSync('show', { type: Boolean, default: false })
  isShow!: boolean

  // 监听 - params
  @Watch('isShow', {})
  public watchValue(val: boolean) {
    this.visible = val
  }
  // 监听 - params
  @Watch('visible', {})
  public watchVisible(val: boolean) {
    this.$emit('update:show', val)
  }
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
    z-index: 1;
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
