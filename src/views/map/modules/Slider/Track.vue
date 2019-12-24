<template>
  <div class="track">
    <!-- 倍速 - 减速 -->
    <i class="sprite_ico sprite_ico_track_back" @click="minusSpeed"></i>
    <!-- 播放/停止  -->
    <i
      class="sprite_ico"
      :class="`sprite_ico_track_${isplay && !end ? 'pause' : 'play'}`"
      @click="playPause"
    ></i>
    <i class="sprite_ico sprite_ico_stop track__stop" @click="stop"></i>
    <!-- 倍速 - 加速 -->
    <i class="sprite_ico sprite_ico_track_forward" @click="addSpeed()"></i>
    <!-- TODO -->
    <!-- <span class="track__time"
      >{{ trackMarkers.length }}/{{ passedLineLength }}</span
    >-->
    <el-slider
      class="track__slider"
      :max="trackMarkersLength"
      :show-tooltip="false"
      :value="value"
      disabled
      @input="input"
    ></el-slider>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator'
import { CarIdBody } from '@/services'
import { Throttle, Bind } from 'lodash-decorators'
const SPEED = 200
@Component({
  name: 'DrawerTrackComponent',
  inheritAttrs: false
})
export default class DrawerTrackComponent extends Vue {
  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Number, default: 0 })
  public readonly trackMarkersLength!: number

  // 搜索参数 .sync
  @PropSync('speed', { type: Number, default: 0 }) speeds!: number

  // value slider的值
  @Prop({ type: Number, default: 0 }) value!: number

  // 搜索参数 .sync
  @PropSync('isPlaying', { type: Boolean, default: false }) isplay!: boolean

  // 是否结束 .sync
  @PropSync('isEnd', { type: Boolean, default: false }) end!: boolean

  slider: number = 0 // 获取已经经过点的长度(操作slider)
  speedCount: number = 50 // 倍速
  // 加速

  @Throttle(1000)
  @Bind()
  addSpeed() {
    if (this.isplay) {
      if (this.speeds < 500) {
        this.speedCount += 50
      } else {
        this.speedCount = 50
      }
      this.$emit('update:speed', this.speeds + this.speedCount)
    }
  }

  // 减速
  @Throttle(1000)
  @Bind()
  minusSpeed() {
    if (this.isplay) {
      if (this.speeds > 200) {
        this.speedCount -= 50
      } else {
        this.speedCount = 50
        this.$emit('update:speed', 50)
      }
      this.$emit('update:speed', this.speeds - this.speedCount)
    }
  }
  // 播放/暂停
  playPause() {
    if (this.trackMarkersLength) {
      this.isplay = !this.isplay
      this.$emit('update:isPlaying', this.isplay)
      this.$emit('play', this.isplay)
    } else {
      this.$message({
        message: '没有轨迹点可以播放',
        type: 'warning'
      })
    }
  }
  stop() {
    this.isplay = false
    this.$emit('update:isPlaying', this.isplay)
    this.$emit('stop')
  }
  input(val) {
    this.$emit('input', val)
  }
  // 监听 - 倍速
  // @Watch('isplay', {})
  // public watchRealTime(val: boolean) {
  //   if (!val) {
  //     this.$emit('update:speed', 200)
  //   }
  // }
}
</script>

<style lang="less" scoped>
.track {
  display: flex;
  align-items: center;
  margin: 0 16px;
  width: 100%;
  &__stop {
    width: 24px;
  }
  .sprite_ico {
    cursor: pointer;
  }
  .sprite_ico,
  &__time {
    margin-right: 27px;
  }
  &__slider {
    width: 100%;
  }
  &__time {
    color: #fff;
    font-size: 12px;
  }
}
</style>
