<template>
  <div class="abnormal">
    <!-- 警告 - 图标 -->
    <div class="abnormal__icon">
      <template v-if="!!num">
        <i
          class="sprite_ico sprite_ico_bar_notice abnormal__icon--item"
          @click="click"
        >
          <span class="abnormal__icon--text">{{ num }}条警告信息</span>
        </i>
      </template>
      <!-- <i
        class="sprite_ico sprite_ico_bar_notice abnormal__icon--item"
        @click="click"
      >
        <span class="abnormal__icon--text">警告信息</span>
      </i> -->
    </div>
    <!-- 警告 - 对话框 -->
    <div class="abnormal__dialog" v-if="showDialog">
      <!-- 对话框 - 头部 -->
      <div class="sprite_ico sprite_ico_dialog__header">
        <i
          class="iconfont icon-guanbi abnormal__dialog--close"
          @click="cancel"
        ></i>
      </div>
      <!-- 对话框 - 内容 -->
      <div class="abnormal__dialog--inner">
        <i class="sprite_ico sprite_ico_dialog_abnormal"></i>
        <div class="abnormal__dialog--text">
          {{ model.carNo }}
          <span class="is-danger">{{ model | filterAbnormalType }}</span>
          <br />建议调度工作人员协调
        </div>
        <div class="abnormal__dialog--footer">
          <div class="abnormal__dialog--button" @click="confirm">实时查看</div>
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
import { WARNGING } from '@/config/dict'
@Component({
  name: 'ButtonAbnormal',
  filters: {
    filterAbnormalType(val) {
      const type = val.location ? val.location.alarmType : ''
      return WARNGING.status[type.toString()].label
    }
  }
})
export default class ButtonAbnormal extends Vue {
  @Prop({ default: 0, type: Number }) public readonly num!: number

  showDialog: boolean = false // 对话框
  model = {}

  // 点击
  click(item) {
    this.showDialog = true
    this.model = item
    item.show = true
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
.is-danger {
  color: #ff0000;
}
.abnormal {
  &__icon {
    position: fixed;
    top: 100px;
    right: 0;
    z-index: 99;
    &--text {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 55%;
      white-space: nowrap;
      color: #ff0000;
      line-height: 1;
      font-size: 12px;
      font-weight: bold;
      font-style: normal;
    }
  }
  &__dialog {
    width: 260px;
    height: 185px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    font-size: 0;
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
      cursor: pointer;
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
