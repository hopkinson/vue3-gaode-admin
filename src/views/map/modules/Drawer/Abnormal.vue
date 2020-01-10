<template>
  <el-drawer
    :visible.sync="visible"
    :modal-append-to-body="false"
    direction="rtl"
    :modal="false"
    :with-header="false"
    size="414px"
    title="当天告警信息"
    class="abnormal__inner"
  >
    <!-- 告警信息列表 -->
    <div class="abnormal">
      <!-- 标题 -->
      <div class="abnormal__title">
        <div class="abnormal__title--inner">当天告警信息</div>
        <div class="abnormal__title--more" @click="$emit('more')" slot="title">
          更多
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <i class="el-icon-close abnormal__title--close" @click="close"></i>
      </div>
      <!-- 列表 -->
      <cell-abnormal v-bind="$attrs" v-on="$listeners"></cell-abnormal>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue, Model, Watch, PropSync } from 'vue-property-decorator'
import CellAbnormal from '../Cell/Abnormal.vue'
@Component({
  name: 'DrawerTrack',
  inheritAttrs: false,
  components: {
    CellAbnormal
  }
})
export default class DrawerTrack extends Vue {
  // 是否正在播放 .sync
  @PropSync('show', { type: Boolean, default: false })
  isShow!: boolean
  // 是否播放中
  visible = false
  // 关闭
  close() {
    this.visible = false
  }
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
.abnormal {
  background: #020215;
  position: relative;
  height: 100%;
  padding: 0 30px 10px 14px;
  border-left: 1px solid #205b83;
  &__title {
    height: 60px;
    line-height: 60px;
    padding-left: 18px;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    border-bottom: 1px solid #2b2b3b;
    position: relative;
    &--more,
    &--close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 1;
      color: #fff;
    }
    &--more {
      font-size: 13px;
      right: 50px;
    }
    &--close {
      right: 0;

      font-size: 20px;
    }
  }
  &__inner {
    & /deep/ .el-drawer__header {
      margin: 0;
      padding: 0;
      background: #000;
    }
    & /deep/ .el-drawer {
      overflow: auto;
    }
    & /deep/ .el-drawer__close-btn,
    & /deep/ span[role*='heading'] {
      font-size: 0;
    }
  }
}
</style>
