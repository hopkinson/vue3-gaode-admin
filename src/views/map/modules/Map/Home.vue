<template>
  <el-amap
    class="maphome"
    ref="map"
    vid="amap-vue"
    :zoom="zoom"
    :zooms="zooms"
    :events="events"
    :center="center"
    :amapManager="amapManager"
  >
    <!-- 信息窗体 -->
    <el-amap-info-window
      :position="position"
      :visible="showInfo"
      :showShadow="false"
      closeWhenClickMap
      autoMove
      :offset="[160, 30]"
    >
      <panel-car-detail
        :data="detail"
        v-model="showInfo"
        v-bind="$attrs"
        v-on="$listeners"
      ></panel-car-detail>
    </el-amap-info-window>
    <!-- 点聚合 -->
    <el-amap-marker
      v-for="(item, index) in markers"
      :key="`market${index}`"
      :position="[item.location.longitude, item.location.latitude]"
      :events="markerEvent(item)"
      :content="markerTemplate(item)"
    ></el-amap-marker>
    <!-- 显示轨迹回放 -->
    <template v-if="showTrack">
      <el-amap-marker
        visible
        :content="markerTemplate(item)"
        :offset="[-29, -105]"
        ref="trackmarker"
        :position="trackMarkers[0]"
      ></el-amap-marker>
      <!-- 折线 -->
      <el-amap-polyline
        :path="trackMarkers"
        strokeColor="#0177fa"
      ></el-amap-polyline>
    </template>
  </el-amap>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Ref } from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import { AMapManager } from 'vue-amap'
import PanelCarDetail from '../Panel/CarDetail.vue'
import { CarIdBody } from '@/services'
import { TRAFFIC_LEGEND } from '@/config/dict'

// import Amap = AMap
let amapManager = new AMapManager()
@Component({
  name: 'MapHome',
  components: {
    PanelCarDetail
  }
})
export default class MapHome extends Vue {
  @Ref('trackmarker') trackmarker: any
  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly trackMarkers!: Array<Array<number>>
  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly markers!: Array<any>
  //  倍速
  @Prop({ type: Number, default: 0 })
  public readonly speed!: number
  //  是否显示轨迹
  @Prop({ type: Boolean, default: false })
  public readonly showTrack!: boolean
  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Function, default: () => {} })
  public readonly fetchCarDetail!: Function
  // 汽车详情
  @Prop({ type: Object, default: () => {} })
  public readonly carDetail!: CarIdBody

  amapManager = amapManager // map的实例
  showInfo = false
  zoom: number = MAP.zoom // 初始化缩放大小
  zooms: Array<number> = MAP.zooms // 缩放比例
  center: Array<number> = MAP.center // 地图中心
  position: Array<number> = MAP.center
  detail = {} // 详情
  plugin: Array<string> = ['PolyEditor', 'MarkerClusterer', 'InfoWindow']
  events = {
    init: o => {
      const self: any = this
      o.setMapStyle(MAP.mapStyle)
      // new AMap.TileLayer({
      //   getTileUrl: MAP.tileUrl,
      //   zIndex: 2
      // })
    }
  }
  markerEvent(item) {
    // 点击 静态的点坐标 - 显示车辆详情信息
    return {
      click: () => {
        const {
          location: { longitude, latitude }
        } = item
        this.detail = item
        this.position = [longitude, latitude]
        this.showInfo = !this.showInfo
        this.$emit('load-car-detail', item)
      }
    }
  }
  // 轨迹 - 开始移动
  moveTracker() {
    this.$nextTick(() => {
      this.trackmarker.$$getInstance().moveAlong(this.trackMarkers, 200)
    })
  }
  // 点坐标 - 模板
  markerTemplate({ carNo, location: { runState } }) {
    return `
  <div class="project__map-marker">
    <p>${carNo}</p>
    <i class="sprite_ico sprite_ico_icon_${
      TRAFFIC_LEGEND[runState.toString()].value
    }"></i>
  </div>
  `
  }
  // 轨迹 - 停止移动
  pauseTracker() {
    this.$nextTick(() => {
      this.trackmarker.$$getInstance().pauseMove()
    })
  }

  // 监听 - 轨迹
  @Watch('trackMarkers', { deep: true, immediate: true })
  public watchTrackMarkerts(val: Array<Array<number>>) {
    if (val) {
      // console.log(val)
    }
  }

  // 监听 - 轨迹
  @Watch('carDetail', { deep: true, immediate: true })
  public watchCarDetail(val: CarIdBody) {
    if (val) {
      const { location } = val
      this.position = location ? location.location : []
      setTimeout(() => {
        this.showInfo = true
      }, 350)
    }
  }

  // 监听 - 倍速
  @Watch('speed', {})
  public watchSpeed(val: number) {
    this.$nextTick(() => {
      this.trackmarker.moveAlong(this.trackMarkers, val)
    })
  }
}
</script>
<style lang="less">
.maphome {
  & /deep/ .amap-info-content {
    background: transparent;
    border: none;
    padding: 0;
    line-height: inherit;
  }

  & /deep/ .amap-info-close,
  & /deep/ .amap-info-sharp {
    display: none;
  }
}
</style>
