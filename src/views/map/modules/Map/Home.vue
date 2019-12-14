<template>
  <el-amap
    class="map"
    ref="map"
    vid="amap-vue"
    :zoom="zoom"
    :zooms="zooms"
    :events="events"
    :center="center"
    :amapManager="amapManager"
  >
    <!-- 信息窗体 -->
    <el-amap-info-window :position="position" v-if="showInfo">
      <panel-car-detail v-bind="$attrs" v-on="$listeners"></panel-car-detail>
    </el-amap-info-window>
    <!-- 点聚合 -->
    <!-- <el-amap-marker
      v-for="(marker, index) in markers"
      :key="`market${index}`"
      :position="marker.position"
      :content="marker.content"
      :events="marker.events"
    ></el-amap-marker> -->
    <el-amap-marker
      icon="/icon/icon_normal.png"
      :offset="[-15, -42]"
      ref="trackmarker"
      :position="trackMarkers[0]"
    ></el-amap-marker>
    <!-- 折线 -->
    <el-amap-polyline
      :path="trackMarkers"
      strokeColor="#0177fa"
    ></el-amap-polyline>
  </el-amap>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Ref } from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import { AMapManager } from 'vue-amap'
import PanelCarDetail from '../Panel/CarDetail.vue'
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
  //  倍速
  @Prop({ type: Number, default: 0 })
  public readonly speed!: number

  amapManager = amapManager
  showInfo = false
  zoom: number = MAP.zoom // 初始化缩放大小
  zooms: Array<number> = MAP.zooms // 缩放比例
  center: Array<number> = [116.478935, 39.997761] || MAP.center // 地图中心
  position: Array<number> = MAP.center

  markers: Array<number> = [] // 汽车的点
  plugin: Array<string> = ['PolyEditor', 'MarkerClusterer']
  events: any = {
    init: o => {
      const self: any = this
      o.setMapStyle(MAP.mapStyle)
      // new AMap.TileLayer({
      //   getTileUrl: MAP.tileUrl,
      //   zIndex: 2
      // })
    }
  }
  // 轨迹 - 开始移动
  moveTracker() {
    this.$nextTick(() => {
      this.trackmarker.moveAlong(this.trackMarkers, 200)
    })
  }

  // 轨迹 - 停止移动
  pauseTracker() {
    this.$nextTick(() => {
      this.trackmarker.pauseMove()
    })
  }

  // 监听 - 轨迹
  @Watch('trackMarkers', { deep: true, immediate: true })
  public watchTrackMarkerts(val: Array<Array<number>>) {
    if (val) {
      // console.log(val)
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
<style lang="less" scoped></style>
