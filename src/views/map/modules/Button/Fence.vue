<template>
  <div class="fence">
    <!-- 查看围栏 -->
    <button
      class="fence__button"
      :class="{ 'is-active': isShowFence }"
      @click="view"
    >
      <span class="fence__button--captial">P</span>
      电子围栏
    </button>
    <!-- 新建围栏 -->
    <!-- <button class="fence__button" @click="edit">
      新增围栏
    </button> -->
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue, PropSync } from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import { getFenceList } from '../../utils/webapi'
@Component({
  name: 'ButtonFenceComponent'
})
export default class ButtonFenceComponent extends Vue {
  // 是否正在播放 .sync
  @PropSync('fence', { type: Array, default: () => [] })
  fenceList!: Array<any>

  isShowFence = false // 是否显示状态
  isEditFence = false // 是否编辑状态
  // 查看
  async view() {
    this.isShowFence = !this.isShowFence
    if (this.isShowFence) {
      const list = await getFenceList()
      this.$emit('update:fence', list)
    } else {
      this.$emit('update:fence', [])
    }
  }
  //   新增
  edit() {
    this.isEditFence = !this.isEditFence
    this.isEditFence ? this.$emit('add') : this.$emit('close')
  }
}
</script>

<style lang="less" scoped>
.fence {
  position: fixed;
  bottom: 50px;
  right: 30px;
  z-index: 1;
  &__button {
    background: #fff;
    border-radius: 2px;
    width: 100px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgb(0, 140, 255);
    border: none;
    font-size: 14px;
    font-weight: bold;
    transition: 0.3s;
    cursor: pointer;
    & + .fence__button {
      margin-left: 4px;
    }
    &:hover,
    &.is-active {
      color: #fff;
      background-image: linear-gradient(
        0deg,
        rgb(8, 177, 255) 0%,
        rgb(4, 116, 255) 58%,
        rgb(0, 54, 255) 100%
      );
    }
    &--captial {
      padding-right: 6px;
      font-size: 18px;
    }
  }
}
</style>
