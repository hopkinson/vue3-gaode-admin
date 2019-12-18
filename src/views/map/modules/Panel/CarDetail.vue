<template>
  <div class="detail" v-if="value">
    <div class="sprite_ico sprite_ico_popup_detail__header">
      <i
        v-if="!realTime"
        class="iconfont icon-guanbi detail--close"
        @click="$emit('input', false)"
      ></i>
    </div>
    <div class="detail__main">
      <!-- 汽车具体信息 -->
      <template v-if="!realTime">
        <h6 :class="stateClass">{{ data.carNo }}</h6>
        <p>当前状态：{{ state }}</p>
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
        <div class="detail--button">
          <slot name="button"></slot>
        </div>
      </template>
      <!-- 实时信息 -->
      <template v-else>
        <p>
          经纬度：
          {{ data.location }}
        </p>
        <p>
          速度：
          {{ data.speed }}公里/小时
        </p>
        <p>
          定位时间：
          {{ data.locateTime | formatDay('YYYY-MM-DD HH:mm:ss') }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
import { TRAFFIC_LEGEND, WARNGING, MAP } from '@/config/dict'
import { CarLocationBody, CarIdBodyLocation, AlarmsIdBody } from '@/services'
import axios from 'axios'

@Component({
  name: 'CarDetail',
  inheritAttrs: false
})
export default class CarDetail extends Vue {
  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean

  // 详情数据
  @Prop({ default: () => {}, type: Object })
  public readonly data!: CarLocationBody

  // 详情数据
  @Prop({ default: () => {}, type: Object })
  public readonly abnormalData!: AlarmsIdBody

  // 是否实时数据
  @Prop({ default: false, type: Boolean })
  public readonly realTime!: boolean

  address = '' // 地址

  // 是否显示异常信息
  get isAbnormal() {
    return Object.keys(this.abnormalData).length
  }

  get stateClass() {
    return this.state === '异常' ? ' is-danger' : ''
  }

  // 获取状态
  get state() {
    let state = ''
    const { location } = this.data
    if (location && !this.realTime) {
      state = TRAFFIC_LEGEND[location.runState.toString()].label
      if (state === '异常') {
        state = location.alarmType
          ? WARNGING.status[location.alarmType.toString()].label
          : '异常'
      }
    }
    return state
  }

  async loadAddress(location) {
    const {
      data: {
        regeocode: { formatted_address }
      }
    } = await axios.get('https://restapi.amap.com/v3/geocode/regeo', {
      params: {
        key: MAP.webapi,
        location: location
      }
    })
    this.address = formatted_address
  }
  // 监听 - params
  @Watch('data', { deep: true })
  public watchData(val) {
    const { location } = val
    if (location && !this.realTime) {
      this.loadAddress(location.location)
    }
  }
  @Watch('abnormalData', { deep: true })
  public watchAbnormalData(val) {
    const { location } = val
    if (location) {
      this.loadAddress(location)
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
