<template>
  <div class="abnormal" v-if="value">
    <!-- 警告 - 图标 -->
    <div class="abnormal__icon" @click="click">
      <!-- 有异常信息 -->
      <i
        class="sprite_ico sprite_ico_bar_notice abnormal__icon--item"
        v-if="!!num"
      >
        <span class="abnormal__icon--text">{{ num }}条警告信息</span>
      </i>
      <!-- 无异常 -->
      <i v-else class="sprite_ico sprite_ico_bar_notice abnormal__icon--item">
        <span class="abnormal__icon--text">警告信息</span>
      </i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import { WARNGING } from '@/config/dict'
@Component({
  name: 'ButtonAbnormal'
})
export default class ButtonAbnormal extends Vue {
  @Prop({ default: 0, type: Number }) public readonly num!: number

  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean

  click() {
    this.$emit('click')
    this.$emit('input', false)
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
}
</style>
