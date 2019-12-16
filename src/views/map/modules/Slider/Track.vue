<template>
  <div class="track">
    <!-- 倍速 - 减速 -->
    <i class="sprite_ico sprite_ico_track_back" @click="minusSpeed"></i>
    <!-- 播放/停止 sprite_ico_track_pause -->
    <i
      class="sprite_ico sprite_ico_track_play"
      :class="`sprite_ico_track_${isplay ? 'pause' : 'play'}`"
      @click="playPause"
    ></i>
    <!-- 倍速 - 加速 -->
    <i class="sprite_ico sprite_ico_track_forward" @click="addSpeed"></i>
    <span class="track__time">03:14/08:00</span>
    <el-slider
      v-model="slider"
      :disabled="!isplay"
      :show-tooltip="false"
    ></el-slider>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator'
import { CarIdBody } from '@/services'
const SPEED = 200
@Component({
  name: 'DrawerTrackComponent',
  inheritAttrs: false
})
export default class DrawerTrackComponent extends Vue {
  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly trackMarkers!: Array<Array<number>>

  // 搜索参数 .sync
  @PropSync('speed', { type: Number, default: 0 }) speeds!: number

  // 搜索参数 .sync
  @PropSync('isPlaying', { type: Boolean, default: false }) isplay!: boolean

  slider: number = 0
  // 减速
  minusSpeed() {
    if (this.isplay) {
      const speed = this.speeds <= SPEED ? SPEED : this.speeds - SPEED
      this.$emit('update:speed', speed)
    }
  }
  // 加速
  addSpeed() {
    if (this.isplay) {
      const speed = this.speeds + SPEED
      this.$emit('update:speed', speed)
    }
  }
  // 播放/暂停
  playPause() {
    if (this.trackMarkers.length) {
      this.$emit('update:isPlaying', !this.isplay)
      this.$emit('play', this.isplay)
    } else {
      this.$message({
        message: '没有轨迹点可以播放',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.track {
  display: flex;
  align-items: center;
  margin: 0 16px;
  .sprite_ico {
    cursor: pointer;
  }
  .sprite_ico,
  &__time {
    margin-right: 27px;
  }
  &__time {
    color: #fff;
    font-size: 12px;
  }
}
</style>
