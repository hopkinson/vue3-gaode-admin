<template>
  <div class="abnormal">
    <!-- 警告 - 图标 -->
    <div class="abnormal__icon" @click="$emit('click')">
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
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'ButtonAbnormal'
})
export default class ButtonAbnormal extends Vue {
  @Prop({ default: 0, type: Number }) public readonly num!: number
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
    cursor: pointer;
    &--text {
      position: absolute;
      top: 45%;
      transform: translate(-50%, -50%);
      left: 58%;
      letter-spacing: 1px;
      white-space: nowrap;
      color: #ff0000;
      font-size: 12px;
      font-weight: bold;
      font-style: normal;
    }
  }
}
</style>
