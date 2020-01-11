<template>
  <div class="track">
    <!-- 倍速 - 减速 -->
    <i class="sprite_ico sprite_ico_track_back" @click="minusSpeed"></i>
    <!-- 播放/停止  -->
    <i
      class="sprite_ico"
      :class="`sprite_ico_track_${isPlaying && !end ? 'pause' : 'play'}`"
      @click="playPause"
    ></i>
    <i class="sprite_ico sprite_ico_stop track__stop" @click="stop"></i>
    <!-- 倍速 - 加速 -->
    <i class="sprite_ico sprite_ico_track_forward" @click="addSpeed"></i>
    <!-- TODO -->
    <el-slider
      @mouseup.native="dragEnd"
      @mousedown.native="dragStart"
      class="track__slider"
      :show-tooltip="false"
      :max="trackLength"
      :value="passedLength"
      :disabled="!trackMarkers.length"
      @input="input"
      @change="change"
    ></el-slider>
  </div>
</template>

<script lang="ts">
import { Mutation, Getter } from 'vuex-class'
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
import { Throttle, Bind } from 'lodash-decorators'
const SPEED = 200
@Component({
  name: 'DrawerTrackComponent',
  inheritAttrs: false
})
export default class DrawerTrackComponent extends Vue {
  // 加速
  get trackLength() {
    return this.trackMarkers.length ? this.trackMarkers.length - 1 : 0
  }

  @Mutation('map/SET_DRAGGING_STATUS') setDraggingStatus // 方法-是否拖拽
  @Mutation('map/SET_TRACK_SPEED') setTrackSpeed // 方法 - 设置播放速度
  @Mutation('map/SET_PLAY_STATUS') setPlayStatus // 方法 - 设置播放状态
  @Mutation('map/SET_TRACK_PASSED_LENGTH') setTrackPassedLength // 方法 - 设置路过的长度

  @Getter('map/isEnd') end!: boolean // 是否结束
  @Getter('map/speed') speed!: number // 播放速度
  @Getter('map/isPlaying') isPlaying!: boolean // 是否在播放轨迹回放
  @Getter('map/trackMarkers') trackMarkers!: Array<CarLocationBody> // 坐标数组
  @Getter('map/passedLength') passedLength!: number // 已经路过的长度

  dragStart() {
    this.setDraggingStatus(true)
  }

  dragEnd() {
    this.setDraggingStatus(false)
  }

  @Throttle(400)
  @Bind()
  addSpeed() {
    if (this.isPlaying) {
      this.setTrackSpeed(this.speed === 5 ? 5 : this.speed + 1)
    }
  }

  // 减速
  @Throttle(400)
  @Bind()
  minusSpeed() {
    if (this.isPlaying) {
      this.setTrackSpeed(this.speed === 1 ? 1 : this.speed - 1)
    }
  }
  // 播放/暂停
  playPause() {
    if (this.trackMarkers.length) {
      this.$emit('play', !this.isPlaying)
      this.setPlayStatus(!this.isPlaying)
    } else {
      this.$message({
        message: '没有轨迹点可以播放',
        type: 'warning'
      })
    }
  }
  stop() {
    this.$emit('stop')
    this.setPlayStatus(false)
  }
  input(val) {
    this.setTrackPassedLength(val)
  }

  change(val) {
    this.setDraggingStatus(false)
    this.$emit('change-slider', val)
  }
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
    & /deep/ .el-slider__runway {
      margin: 0;
    }
  }
  &__time {
    color: #fff;
    font-size: 12px;
  }
}
</style>
