<template>
  <div class="track">
    <!-- 倍速 - 减速 -->
    <i class="sprite_ico sprite_ico_track_back" @click="minusSpeed"></i>
    <!-- 播放/停止 sprite_ico_track_pause -->
    <i class="sprite_ico sprite_ico_track_play" @click="playPause"></i>
    <!-- 倍速 - 加速 -->
    <i class="sprite_ico sprite_ico_track_forward" @click="addSpeed"></i>
    <span class="track__time">03:14/08:00</span>
    <el-slider v-model="slider" :show-tooltip="false"></el-slider>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
const SPEED = 200
@Component({
  name: 'DrawerTrackComponent',
  inheritAttrs: false
})
export default class DrawerTrackComponent extends Vue {
  // 搜索参数 .sync
  @PropSync('speed', { type: Number, default: 0 }) speed!: number
  // 倍速
  _speed: number = SPEED
  slider: number = 0
  // 是否播放中
  isPlaying: boolean = false
  // 减速
  minusSpeed() {
    this._speed = this._speed <= SPEED ? SPEED : this._speed - SPEED
    this.$emit('update:speed', this._speed)
  }
  // 加速
  addSpeed() {
    this._speed = this._speed + SPEED
    this.$emit('update:speed', this._speed)
  }
  // 播放/暂停
  playPause() {
    this.isPlaying = !this.isPlaying
    this.$emit('play', this.isPlaying)
  }
}
</script>

<style lang="less" scoped>
.track {
  display: flex;
  align-items: center;
  margin: 0 16px;
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
