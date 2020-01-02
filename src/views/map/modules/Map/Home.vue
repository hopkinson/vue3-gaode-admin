<template>
  <section class="maphome">
    <el-amap
      ref="map"
      class="maphome__inner"
      vid="amap-vue"
      resizeEnable
      expandZoomRange
      :zoom="zoom"
      :zooms="zooms"
      :events="events"
      :center="center"
    >
      <!-- 多边形 - 围栏列表 -->
      <template v-for="(polygon, index) in fenceList">
        <el-amap-polygon
          :path="fencepath(polygon.points)"
          :key="`fencepolygon${index}`"
          fillColor="rgb(55, 70, 95)"
          strokeColor="rgb(0, 140, 255)"
          strokeStyle="dashed"
          :strokeWeight="2"
          :fillOpacity="0.4"
        ></el-amap-polygon>
        <el-amap-marker
          :key="`fenceMarker${index}`"
          icon="/icon/parking.png"
          :position="polygon.center | filterSplitArr(',')"
        ></el-amap-marker>
      </template>
      <!-- 信息窗体 - 详情 -->
      <el-amap-info-window
        :position="position"
        :visible="showInfo"
        :showShadow="false"
        :offset="[140, -40]"
        closeWhenClickMap
        autoMove
      >
        <panel-car-detail
          v-model="showInfo"
          :data="carDetail"
          :realTime="realTime"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <div class="maphome--button" slot="button">
            <span @click="trackPlay">轨迹回放</span>
          </div>
        </panel-car-detail>
      </el-amap-info-window>
      <!-- 点坐标 -->
      <template v-for="(item, index) in markers">
        <el-amap-marker
          :key="index"
          v-if="item.location"
          :visible="item.location && !showTrack && !showDrawer && !showInfo"
          :offset="[-26, -103]"
          :position="item.location | filterSplitArr(',')"
          :events="markerEvent(item)"
          :content="
            markerTemplate(item, {
              show: !showTrack && !showDrawer && !showInfo
            })
          "
        ></el-amap-marker>
      </template>
      <!-- 点坐标 - 用户轨迹播放  -->
      <el-amap-marker
        ref="marker"
        :offset="carDetail.alarmType ? [-26, -135] : [-27, -103]"
        :visible="showDrawer || showInfo"
        :events="trackMarkerEvent(carDetail)"
        :position="position"
        :label="markerLabelContent(realTimeDetail)"
        :content="
          Object.keys(carDetail).length ? markerTemplate(carDetail) : ''
        "
      ></el-amap-marker>
      <!-- 轨迹 -->
      <!-- 轨迹 - 无异常 -->
      <el-amap-polyline
        :path="normalTracks"
        strokeColor="#fff000"
      ></el-amap-polyline>
      <!-- 轨迹 - 异常 -->
      <el-amap-polyline
        :path="abnormalTracks"
        strokeColor="#ff010b"
      ></el-amap-polyline>
      <!-- 轨迹 - 所有 -->
      <el-amap-polyline
        :path="trackLocation"
        ref="polyline"
        strokeColor="transparent"
      ></el-amap-polyline>
      <!-- 轨迹 - 路过 -->
      <el-amap-polyline
        :path="havePassedLine"
        strokeColor="#500018"
      ></el-amap-polyline>
    </el-amap>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Prop,
  Ref,
  PropSync,
  Mixins
} from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import PanelCarDetail from '../Panel/CarDetail.vue'
import { CarIdBody, CarLocationBody, CarSpeedBody } from '@/services'
import { TRAFFIC_LEGEND, WARNGING } from '@/config/dict'
import { formatDay } from '../../../../utils/filters'
import MixinsFence from './mixins/Fence'
import MixinsMouseTool from './mixins/MouseTool'
import MixinsMarkerClusterer from './mixins/MarkerClusterer'
import MixinsPreTrack from './mixins/PreTrack'
@Component({
  name: 'MapHome',
  components: {
    PanelCarDetail
  },
  filters: {
    filterSplitArr(val, sign) {
      return val ? val.split(sign || ',') : []
    }
  }
})
export default class MapHome extends Mixins(
  MixinsMouseTool,
  MixinsFence,
  MixinsMarkerClusterer,
  MixinsPreTrack
) {
  @Ref('marker') marker: any
  @Ref('map') map: any
  @Ref('polyline') polyline: any
  @Ref('passedPolyline') passedPolyline: any

  // 是否正在播放 .sync
  @Prop({ type: Boolean, default: false })
  isPlay!: boolean

  // 是否结束播放 .sync
  @Prop({ type: Boolean, default: false })
  isEnd!: boolean

  //  坐标数组
  @PropSync('trackMarkers', { type: Array, default: () => [] })
  getTrackMarkers!: Array<CarLocationBody>

  //  坐标数组
  @PropSync('passedLength', { type: Number, default: 0 })
  getPassedLength!: number

  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly markers!: Array<any>

  // 是否显示抽屉（用于轨迹回放）
  @Prop({ type: Boolean, default: false })
  public readonly showDrawer!: boolean

  //  倍速
  @Prop({ type: Number, default: 0 })
  public readonly speed!: number

  // 汽车详情
  @Prop({ type: Object, default: () => {} })
  public readonly carDetail!: CarIdBody

  // 围栏列表坐标
  @Prop({ type: Number, default: 0 })
  public readonly sliderVal!: number
  showInfo = false // 是否显示窗体信息
  showTrack = false // 是否显示轨迹
  realTime = false // 是否实时
  zoom: number = MAP.zoom // 初始化缩放大小
  zooms: Array<number> = MAP.zooms // 缩放比例
  realTimeDetail: any = {} // 实时窗体详情
  center: Array<number | string> = MAP.center // 地图中心
  position: Array<number | string> = MAP.center // 地图中心

  havePassedLine: Array<Array<number | string>> = [] // 已经走过的轨迹
  trackLocation: Array<Array<number | string>> = [] //轨迹的坐标系数据
  //轨迹的坐标系（无警告）
  normalTracks: Array<Array<number | string>> = []
  //轨迹的坐标系（有警告）
  abnormalTracks: Array<Array<number | string>> = []
  countPassed: number = 0 // 累积经过了多少个点
  // 地图事件
  events = {
    init: o => {
      o.setMapStyle(MAP.mapStyle)
      // 设置高精度图层
      const googleLayer = new AMap.TileLayer({
        getTileUrl: MAP.tileUrl,
        zIndex: 2
      })
      const self = this
      googleLayer.setMap(o)

      // 设置聚合坐标
      this.initMarkerCluster(o)
    }
  }
  // 点坐标的内容
  markerLabelContent(realTimeDetail) {
    const type = realTimeDetail.alarmType
      ? WARNGING.status[String(realTimeDetail.alarmType)].label
      : '无异常'
    const isWarning = !!realTimeDetail.alarmType
    return {
      content:
        !this.showInfo &&
        this.showDrawer &&
        `
      <div class="project__map-markerLabel">
        <div class="project__map-markerLabel__main">
            <p>
              当前状态：<span class="${
                isWarning ? 'is-danger' : ''
              }">${type}</span>
            </p>
            <p>
              速度：${realTimeDetail.speed}公里/小时
            </p>
            <p>
              定位时间：${formatDay(
                realTimeDetail.locateTime,
                'YYYY-MM-DD HH:mm:ss'
              )}
            </p>
        </div>
      </div>`,
      offset: [65, -55]
    }
  }

  // 轨迹点坐标事件
  trackMarkerEvent() {
    return {
      click: () => {
        if (!this.realTime) {
          setTimeout(() => {
            this.realTime = false
            this.showInfo = true
          }, 200)
        }
      },
      moveend: () => {
        const isNotEuqal = this.getTrackMarkers.length !== this.countPassed + 1
        this.$emit('update:passedLength', this.countPassed + 1)
        if (isNotEuqal) {
          this.moveToTracker()
        } else {
          this.realTime = false
          this.showInfo = true
        }
      }
    }
  }
  // 点坐标事件
  markerEvent(item) {
    // 点击 静态的点坐标 - 显示车辆详情信息
    return {
      init: o => {
        this.markerRefs.push(o)
      },
      click: () => {
        const { location } = item
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
  markerTemplate(
    { carNo, location, runState, alarmType },
    { show = true } = {}
  ) {
    let content = ''
    if (location && show) {
      const alarmTypeIcon = runState === 3 && !!alarmType
      content = `
  <div class="project__map-marker">
    <i class="sprite_ico sprite_ico_${alarmTypeIcon &&
      WARNGING.status[alarmType.toString()].value}" style="display:${
        !alarmTypeIcon ? 'none' : 'inline-block'
      }"></i>
    <p>${carNo}</p>
    <i class="sprite_ico sprite_ico_icon_${
      TRAFFIC_LEGEND[runState.toString()].value
    }"></i>
  </div>
  `
    }

    return content
  }
  // 轨迹回放
  trackPlay() {
    this.$emit('play-track', { realTime: this.realTime, data: this.carDetail })
  }

  // 轨迹 - 开始移动
  moveTracker() {
    if (!this.realTime) {
      this.moveToTracker()
      this.realTime = true
      this.showInfo = false
      this.marker.$$getInstance().on('moving', e => {
        this.havePassedLine.push(e.passedPath[e.passedPath.length - 1])
        setTimeout(() => {
          const accro = e.passedPath[e.passedPath.length - 1]
          this.position = [accro.lng, accro.lat]
          this.center = this.position
        }, 0)
      })
    } else {
      this.marker.$$getInstance().resumeMove()
    }
  }
  // 轨迹移动
  moveToTracker() {
    const _nextPoint = this.getTrackMarkers[this.countPassed + 1]
    if (_nextPoint) {
      const { location } = _nextPoint
      const { speed } = this.getTrackMarkers[this.countPassed]
      const _location: Array<number | string> = location.split(',')
      const _lnglat = new AMap.LngLat(
        Number(_location[0]),
        Number(_location[1])
      )
      this.countPassed++
      this.realTimeDetail = this.getTrackMarkers[this.countPassed]
      this.marker.$$getInstance().moveTo(_lnglat, speed * this.speed * 2.5)
    }
  }

  // 轨迹 - 停止移动
  pauseTracker() {
    this.marker.$$getInstance().pauseMove()
  }

  // 初始化轨迹移动
  initLoadTrack() {
    if (this.getTrackMarkers.length) {
      this.abnormalTracks = this.normalTracks = [] // 清空
      // 分是否警告去显示经纬度
      this.abnormalTracks = this.getTrackMarkers
        .filter(item => item.alarmType)
        .map(item => item.location.split(','))
      this.normalTracks = this.getTrackMarkers
        .filter(item => !item.alarmType)
        .map(item => item.location.split(','))
      // 格式化数据
      this.trackLocation = this.getTrackMarkers.map(item =>
        item.location.split(',')
      )
      // 每走一个点 中心都发生改变
      setTimeout(() => {
        const { lng, lat } = this.polyline.$$getInstance().getPath()[0]
        this.position = this.center = [lng, lat]
      }, 0)
    }
  }
  // 停止移动要把一切设为停止
  stopMove() {
    this.$emit('stop-move')
    this.realTime = false
    this.havePassedLine = [] // 清空已走过的轨迹
    this.countPassed = 1
    this.$emit('update:passedLength', 0)
    this.$nextTick(() => {
      this.marker.$$getInstance().stopMove()
      this.initLoadTrack()
    })
  }

  // 监听 - 轨迹
  @Watch('getTrackMarkers', { deep: true })
  public watchTrackMarkerts(val: Array<CarLocationBody>) {
    this.showTrack = !!val && !!val.length // 如果有坐标，则显示轨迹
    if (val.length) {
      this.initLoadTrack()
    }
  }

  // 停止播放
  @Watch('isEnd', {})
  public watchIsEnd(val) {
    if (val) {
      this.stopMove()
    }
  }

  // 滑块准备
  @Watch('sliderVal', {})
  public watchPassedLength(val) {
    // this.havePassedLine = this.trackLocation.slice(0, val)
    // this.countPassed = val
    // this.moveToTracker()
  }

  // 监听 - 是否显示抽屉
  @Watch('showDrawer', {})
  public watchshowDrawer(val: boolean) {
    if (!val) {
      this.havePassedLine = [] // 已经走过的轨迹
      this.trackLocation = [] //轨迹的总坐标系
      this.$nextTick(() => {
        this.normalTracks = [] // 轨迹的坐标系（无警告）
        this.abnormalTracks = [] // 轨迹的坐标系（有警告）
      })
      this.stopMove()
      this.showInfo = false
    }
  }

  // 监听 - 轨迹
  @Watch('showTrack', {})
  public watchShowTrack(val: boolean) {
    if (val) {
      this.realTimeDetail = this.getTrackMarkers[0] // 实时信息
      this.showInfo = false // 把汽车详情隐藏
    } else {
      this.realTime = false
    }
  }

  // 监听 - 轨迹
  @Watch('carDetail', { deep: true })
  public async watchCarDetail(val) {
    if (val.id) {
      this.initPreTrack(val)
      const { alarmType } = val
      setTimeout(() => {
        // 1. 改变地图中心
        this.center = val.location.split(',')
        this.position = this.center
        // 2. 不是实时
        this.realTime = false
        // 3. 显示信息窗体（分两种情况：）
        // 3.1 如果有alarmNumber，则不显示；没有则显示
        this.showInfo = !val.alarmNumber
      }, 1)
    }
  }

  // 监听 - 是否实时播放
  @Watch('realTime', {})
  public watchRealTime(val: number) {
    if (!val) {
      this.stopMove()
    }
  }
}
</script>
<style lang="less" scoped>
.maphome {
  width: 100%;
  height: 100%;
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
