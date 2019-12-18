<template>
  <section class="maphome">
    {{ showTrack || !!Object.keys(carDetail).length }}
    <el-amap
      ref="map"
      vid="amap-vue"
      :resizeEnable="true"
      :expandZoomRange="true"
      :zoom="zoom"
      :zooms="zooms"
      :events="events"
      :center="center"
      :plugin="plugin"
      :amapManager="amapManager"
    >
      <!-- 信息窗体 - 详情 -->
      <el-amap-info-window
        :position="position"
        :visible="showInfo"
        :showShadow="false"
        :offset="!realTime ? [140, -40] : [130, -40]"
        closeWhenClickMap
        autoMove
      >
        <panel-car-detail
          :data="realTime ? realTimeDetail : carDetail"
          v-model="showInfo"
          :realTime="realTime"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <span @click="trackPlay" slot="button">轨迹回放</span>
        </panel-car-detail>
      </el-amap-info-window>
      <!-- 点坐标 -->
      <template v-if="!showTrack">
        <el-amap-marker
          v-for="(item, index) in markers"
          :key="index"
          :offset="[-26, -103]"
          :position="item.location.location | filterPosition"
          :events="markerEvent(item)"
          :content="markerTemplate(item)"
        ></el-amap-marker>
      </template>

      <!-- 显示轨迹回放 -->
      <!-- 点坐标 - 用户动画播放 -->
      <el-amap-marker
        ref="marker"
        :offset="[-26, -103]"
        :visible="showTrack"
        :content="
          Object.keys(carDetail).length ? markerTemplate(carDetail) : ''
        "
        :position="position"
      ></el-amap-marker>
      <!-- 信息窗体 - 实际轨迹 -->
      <!-- 折线 - 实际-->
      <el-amap-polyline
        ref="trackPolyLine"
        :path="trackLocation"
        :strokeColor="!isAbnormal ? '#fff000' : 'ff010b'"
      ></el-amap-polyline>
      <!-- 折线 - 已走的轨迹 -->
      <el-amap-polyline
        ref="trackPolyLine"
        :path="trackPassedLocation"
        strokeColor="#435a70"
      ></el-amap-polyline>
      <!-- 折线  - 预设-->
      <el-amap-polyline
        :path="preMarkers"
        strokeColor="#0177fa"
      ></el-amap-polyline>
    </el-amap>
    <slot></slot>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Prop,
  Ref,
  PropSync
} from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import { AMapManager } from 'vue-amap'
import PanelCarDetail from '../Panel/CarDetail.vue'
import { CarIdBody, CarIdBodyLocation } from '@/services'
import { TRAFFIC_LEGEND } from '@/config/dict'

// import Amap = AMap
let amapManager = new AMapManager()
@Component({
  name: 'MapHome',
  components: {
    PanelCarDetail
  },
  filters: {
    filterPosition(val) {
      return val ? val.split(',') : []
    }
  }
})
export default class MapHome extends Vue {
  @Ref('marker') marker: any
  @Ref('map') map: any

  // 是否正在播放 .sync
  @PropSync('isPlaying', { type: Boolean, default: false })
  isPlayTrack!: boolean

  // 折线&点 - 坐标（用于轨迹回放）
  @PropSync('trackMarkers', { type: Array, default: () => [] })
  getTrackMarkers!: Array<CarIdBodyLocation>

  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly markers!: Array<any>

  // 获取已经经过点的长度
  @Prop({ type: Number, default: 0 })
  public readonly passedLength!: number

  //  倍速
  @Prop({ type: Number, default: 0 })
  public readonly speed!: number

  //  请求预设轨迹的接口
  @Prop({ type: Function, default: () => {} })
  public readonly loadPreTrack!: Function

  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Function, default: () => {} })
  public readonly fetchCarDetail!: Function
  // 汽车详情
  @Prop({ type: Object, default: () => {} })
  public readonly carDetail!: CarIdBody

  amapManager = amapManager // map的实例
  showInfo = false // 是否显示窗体信息
  showTrack = false // 是否显示轨迹
  realTime = false
  zoom: number = MAP.zoom // 初始化缩放大小
  zooms: Array<number> = MAP.zooms // 缩放比例
  realTimeDetail = {} // 实时窗体详情
  center: Array<number | string> = MAP.center // 地图中心
  position: Array<number | string> = MAP.center // 地图中心
  preMarkers: Array<Array<number>> = [] // 预设轨迹
  trackPassedLocation: Array<Array<number>> = [] // 已经走过的轨迹
  NoPassedLine: Array<Array<number | string>> = [] // 将未运动的点变成新的点
  plugin: Array<string> = ['PolyEditor', 'MarkerClusterer', 'InfoWindow']
  isAbnormal: boolean = false // 是否属于异常
  trackLocation: Array<Array<number | string>> = [] //轨迹的坐标系
  events = {
    init: o => {
      const self: any = this
      o.setZoom
      o.setMapStyle(MAP.mapStyle)
      const googleLayer = new AMap.TileLayer({
        getTileUrl: MAP.tileUrl,
        zIndex: 2
      })
      googleLayer.setMap(o)
      setTimeout(() => {
        let cluster = new (AMap as any).MarkerClusterer(o, self.markers, {
          gridSize: 30,
          renderCluserMarker: self._renderCluserMarker
        })
        console.log(cluster)
      }, 1000)
    }
  }

  markerEvent(item) {
    // 点击 静态的点坐标 - 显示车辆详情信息
    return {
      click: () => {
        const {
          location: { location }
        } = item
        setTimeout(() => {
          this.position = location ? location.split(',') : []
          this.center = this.position
          this.showInfo = !this.showInfo
        }, 200)
        this.$emit('load-car-detail', item)
      }
    }
  }

  // 点坐标 - 模板
  markerTemplate({ carNo, location: { runState, alarmType } }) {
    return `
  <div class="project__map-marker">
    <i class="sprite_ico sprite_ico_icon_${runState === 3 &&
      !!alarmType &&
      TRAFFIC_LEGEND[alarmType.toString()].value}" style="display:${
      runState === 3 ? 'none' : 'inline-block'
    }"></i> 
    <p>${carNo}</p>
    <i class="sprite_ico sprite_ico_icon_${
      TRAFFIC_LEGEND[runState.toString()].value
    }"></i>
  </div>
  `
  }
  // 轨迹回放
  trackPlay() {
    this.$emit('play-track', { realTime: this.realTime, data: this.carDetail })
  }

  // 轨迹 - 开始移动
  moveTracker() {
    this.$nextTick(() => {
      this.marker.$$getInstance().moveAlong(this.trackLocation, 200)
    })
  }

  // 轨迹 - 停止移动
  pauseTracker() {
    this.$nextTick(() => {
      this.marker.$$getInstance().pauseMove()
    })
  }
  // 点坐标聚合
  _renderCluserMarker(context) {
    const count = this.markers.length

    let factor = Math.pow(context.count / count, 1 / 18)
    let div = document.createElement('div')
    let Hue = 180 - factor * 180
    let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
    let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
    div.style.backgroundColor = bgColor
    let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
    div.style.width = div.style.height = size + 'px'
    div.style.borderRadius = '50%'
    div.innerHTML = context.count
    div.style.lineHeight = size + 'px'
    div.style.color = fontColor
    div.style.fontSize = '12px'
    div.style.textAlign = 'center'
    const result = `
    <div style="color:#fff">312312312${Hue}</div>
    `
    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
    context.marker.setContent(result)
  }
  // 监听 - 轨迹
  @Watch('getTrackMarkers', { deep: true, immediate: true })
  public watchTrackMarkerts(val: Array<CarIdBodyLocation>) {
    this.showTrack = !!val && !!val.length // 如果有坐标，则显示轨迹
    if (val.length) {
      setTimeout(() => {
        this.trackLocation = val.map(item => item.location.split(','))
        this.position = val[0].location.split(',')
        this.center = this.position
      }, 200)
    }
  }

  // 监听 - 轨迹
  @Watch('showTrack', {})
  public watchShowTrack(val: boolean) {
    if (val) {
      this.realTime = true
      this.realTimeDetail = this.getTrackMarkers[0] // 实时信息
      this.$nextTick(() => {
        // 监听 - 轨迹移动中
        this.marker.$$getInstance().on('moving', e => {
          this.$emit('on-passed-line', e.passedPath.length) // 获取已经经过点的长度
          if (e.passedPath.length === this.trackLocation.length) {
            this.realTime = false
            this.$emit('upadte:isPlaying', false)
          }
          //截取未运动的点
          if (e.passedPath.length >= 2) {
            this.NoPassedLine = this.trackLocation.slice(
              e.passedPath.length - 2
            )
          }
          //已经经过的点
          this.trackPassedLocation = e.passedPath //将未运动的点变成新的点
          // this.trackLocation = this.NoPassedLine
          this.realTimeDetail = this.getTrackMarkers[e.passedPath.length - 1]
          const accro = e.passedPath[e.passedPath.length - 1]
          setTimeout(() => {
            this.position = [accro.lng, accro.lat]
            this.center = this.position
          }, 0)
        })
      })
    } else {
      this.realTime = false
    }
  }

  // 监听 - 轨迹
  @Watch('carDetail', { deep: true, immediate: true })
  public async watchCarDetail(val: CarIdBody) {
    if (Object.keys(val).length) {
      this.preMarkers = await this.loadPreTrack(val) // 加载预设轨迹
      const { location } = val
      if (!location) {
        this.showInfo = false
        return this.$message({
          message: '找不到位置',
          type: 'warning'
        })
      }
      this.isAbnormal = !!location.alarmType // 异常
      setTimeout(() => {
        this.center = location ? location.location.split(',') : []
        this.position = this.center
        this.realTime = false
        this.showInfo = true
      }, 350)
    }
  }

  // 监听 - 是否实时播放
  @Watch('realTime', {})
  public watchRealTime(val: number) {
    if (!val) {
      this.$emit('upadte:isPlaying', false)
      this.marker.$$getInstance().stopMove()
    }
  }

  // 监听 - 滑动
  @Watch('passedLength', {})
  public watchpassedLength(val: number) {
    if (!this.isPlayTrack) {
      this.$nextTick(() => {
        this.marker.$$getInstance().moveTo(this.trackLocation[val], 0)
      })
    }
  }

  // // 监听 - 倍速
  // @Watch('speed', {})
  // public watchSpeed(val: number) {
  //   this.marker.$$getInstance().moveAlong(this.trackLocation, val)
  // }
}
</script>
<style lang="less" scoped>
.maphome {
  width: 100%;
  height: 100%;
}
</style>
