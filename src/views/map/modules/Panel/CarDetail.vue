<template>
  <div class="detail" v-if="value">
    <div class="sprite_ico sprite_ico_popup_detail__header">
      <!-- <i
        v-if="!realTime"
        class="iconfont icon-guanbi detail--close"
        @click="$emit('input', false)"
      ></i> -->
    </div>
    <div class="detail__main">
      <!-- 汽车具体信息 -->
      <h6>{{ data.carNo }}</h6>
      <p>
        当前状态：<span :class="stateClass">{{ state }}</span>
      </p>
      <p>隶属单位：{{ data.companyName || '无' }}</p>
      <p>当前速度：{{ data.speed || 0 }}公里/小时</p>
      <p>最后定位：{{ data.address }}</p>
      <p>定位时间：{{ data.locateTime | formatDay('YYYY-MM-DD HH:mm:ss') }}</p>
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
import { TRAFFIC_LEGEND, WARNGING, MAP } from '@/config/dict'
import { CarLocationBody, AlarmsIdBody } from '@/services'
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

  // 是否显示警告信息
  get isAbnormal() {
    return Object.keys(this.abnormalData).length
  }

  get stateClass() {
    const { alarmType } = this.data
    return alarmType ? ' is-danger' : ''
  }

  // 获取状态
  get state() {
    let state = ''
    const { runState, alarmType } = this.data
    if (runState) {
      state = TRAFFIC_LEGEND[runState.toString()].label
    }
    if (alarmType) {
      state = WARNGING.status[alarmType.toString()].label
    }
    return state
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
      font-weight: bold;
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
}
</style>
