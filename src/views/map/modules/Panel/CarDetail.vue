<template>
  <div class="detail" v-if="value">
    <div class="sprite_ico sprite_ico_popup_detail__header">
      <i
        class="iconfont icon-guanbi detail--close"
        @click="$emit('input', false)"
      ></i>
    </div>
    <div class="detail__main">
      <h6>{{ data.carNo }}</h6>
      <p>
        当前状态：
        <span :class="stateClass">{{ state }}</span>
      </p>
      <p>隶属单位：{{ data.companyName || '无' }}</p>
      <p v-if="data.location">
        当前速度：{{ data.location.speed || 0 }}公里/小时
      </p>
      <p>最后定位：{{ address }}</p>
      <p v-if="data.location">
        定位时间：{{
          data.location.locateTime | formatDay('YYYY-MM-DD HH:mm:ss')
        }}
      </p>
      <div class="detail--button" @click="trackPlay">轨迹回放</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
import { TRAFFIC_LEGEND, WARNGING, MAP } from '@/config/dict'
import { CarLocationBody } from '@/services'
import axios from 'axios'
@Component({
  name: 'CarDetail',
  inheritAttrs: false
})
export default class CarDetail extends Vue {
  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean

  @Prop({ default: () => {}, type: Object })
  public readonly data!: CarLocationBody

  address = '' // 地址

  get stateClass() {
    return this.state === '异常' ? ' is-danger' : ''
  }
  // 获取状态
  get state() {
    let state = ''
    const { location } = this.data
    if (location) {
      state = TRAFFIC_LEGEND[location.runState.toString()].label
      if (state === '异常') {
        state = location.alarmType
          ? WARNGING.status[location.alarmType.toString()].label
          : '异常'
      }
    }
    return state
  }
  trackPlay() {
    this.$emit('play-track', this.data)
    // this.$emit('input', false)
  }

  // 监听 - params
  @Watch('data', { deep: true })
  public async watchData(val) {
    const { location } = val
    if (location) {
      const {
        data: {
          regeocode: { formatted_address }
        }
      } = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
        params: {
          key: MAP.webapi,
          location: location.location
        }
      })
      this.address = formatted_address
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  position: relative;
  font-size: 0;
  &__main {
    color: #fff;
    position: relative;
    border-left: 1px solid #0f6980;
    border-right: 1px solid #0f6980;
    border-bottom: 1px solid #0f6980;
    background: #020215;
    padding: 0 10px 20px;
    font-size: 12px;
    max-width: 221px;
    .is-danger {
      color: #ee1013;
    }
    h6 {
      font-size: 14px;
      color: rgb(0, 253, 255);
      margin-bottom: 12px;
    }
    p {
      margin-bottom: 12px;
    }
  }
  &--close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 13px;
    color: #0ccfdd;
    cursor: pointer;
  }
  &--button {
    width: 66px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background: transparent;
    color: rgb(34, 168, 238);
    font-size: 12px;
    border: 1px solid rgb(34, 168, 238);
    margin-top: 12px;
    cursor: pointer;
    &:hover {
      background: rgb(34, 168, 238);
      color: #fff;
    }
  }
}
</style>
