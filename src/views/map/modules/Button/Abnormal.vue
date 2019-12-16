<template>
  <div class="abnormal">
    <!-- 异常 - 图标 -->
    <div class="abnormal__icon">
      <i
        class="sprite_ico sprite_ico_bar_notice"
        v-for="(item, index) in data"
        :key="index"
        @click="click(item)"
      >
        <span class="abnormal__icon--text">粤A3KX62异常</span>
      </i>
    </div>
    <!-- 异常 - 对话框 -->
    <div class="abnormal__dialog" v-if="showDialog">
      <!-- 对话框 - 头部 -->
      <div class="sprite_ico sprite_ico_dialog__header">
        <i class="iconfont icon-guanbi abnormal__dialog--close"></i>
      </div>
      <!-- 对话框 - 内容 -->
      <div class="abnormal__dialog--inner">
        <i class="sprite_ico sprite_ico_dialog_abnormal"></i>
        <div class="abnormal__dialog--text">
          粤AOR35L6异常偏离指定路线
          <br />建议调度工作人员协调
        </div>
        <div class="abnormal__dialog--footer">
          <div class="abnormal__dialog--button" @click="confirm">
            实时查看
          </div>
          <div class="abnormal__dialog--button is-plain" @click="cancel">
            取消
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ButtonAbnormal'
})
export default class ButtonAbnormal extends Vue {
  @Prop({ default: () => [], type: Array }) public readonly data!: Array<any>

  showDialog: boolean = false // 对话框
  model = {}

  // 点击
  click(item) {
    this.showDialog = true
    this.model = item
  }
  cancel() {
    this.showDialog = false
    this.$emit('cancel')
  }
  confirm() {
    this.showDialog = false
    this.$emit('confirm', this.model)
  }
}
</script>

<style lang="less" scoped>
.abnormal {
  position: fixed;

  &__icon {
    position: fixed;
    top: 100px;
    right: 0;
    z-index: 99;
    &--text {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 35px;
      color: rgb(255, 0, 0);
      font-size: 12px;
      font-weight: bold;
    }
  }
  &__dialog {
    position: relative;
    &--inner {
      border-left: 1px solid #0f6980;
      border-right: 1px solid #0f6980;
      border-bottom: 1px solid #0f6980;
      background: #020213;
      padding: 0 23px 20px;
      text-align: center;
    }
    &--footer {
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &--text {
      margin: 14px auto 30px;
      color: #fff;
      line-height: 1.714;
      font-size: 14px;
    }
    &--button {
      width: 78px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border-radius: 2px;
      background-color: rgb(34, 168, 238);
      color: #fff;
      font-size: 12px;
      border: 1px solid rgb(34, 168, 238);
      &.is-plain {
        background: transparent;
        color: rgb(34, 168, 238);
      }
    }
    &--close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 13px;
      color: #0ccfdd;
    }
  }
}
</style>
