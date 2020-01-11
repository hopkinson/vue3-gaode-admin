<template>
  <section class="maphome">
    <el-amap
      ref="map"
      class="maphome__inner"
      vid="amap-vue"
      :resizeEnable="true"
      :expandZoomRange="true"
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
        :visible="showTrackMarker"
        :events="trackMarkerEvent(carDetail)"
        :position="position"
        :label="markerLabelContent(realTimeDetail)"
        :content="trackMarkerContent"
      ></el-amap-marker>
      <!-- 轨迹 -->
      <!-- 轨迹 - 无异常 -->
      <el-amap-polyline
        :path="trackLocation"
        ref="polyline"
        strokeColor="#fff000"
      ></el-amap-polyline>
      <!-- 轨迹 - 异常 -->
      <el-amap-polyline
        :path="item"
        :key="`polyline${index}`"
        v-for="(item, index) in abnormalTracks"
        strokeColor="#ff010b"
      ></el-amap-polyline>
      <!-- 轨迹 - 所有 -->
      <!-- 轨迹 - 路过 -->
      <el-amap-polyline
        :z-index="52"
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
import { Getter, Mutation } from 'vuex-class'
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

  @Mutation('map/SET_TRACK_STATUS') setTrackStatus // 方法 - 是否结束
  @Mutation('map/SET_PLAY_STATUS') setPlayStatus // 方法 - 设置播放状态
  @Mutation('map/SET_TRACK_PASSED_LENGTH') setTrackPassedLength // 方法 - 设置路过的长度

  @Getter('map/isDragging') isDragging!: boolean // 是否拖拽中
  @Getter('map/speed') speed!: number // 播放速度
  @Getter('map/isEnd') isEnd!: boolean // 是否结束
  @Getter('map/isPlaying') isPlaying!: boolean // 是否在播放轨迹回放
  @Getter('map/trackMarkers') trackMarkers!: Array<CarLocationBody> // 坐标数组
  @Getter('map/showDrawer') showDrawer!: boolean // 是否显示底部抽屉（轨迹）
  @Getter('map/passedLength') passedLength!: number // 已经路过的长度

  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly markers!: Array<any>

  // 汽车详情
  @Prop({ type: Object, default: () => {} })
  public readonly carDetail!: CarIdBody

  // 围栏列表坐标
  @Prop({ type: Number, default: 0 })
  public readonly sliderVal!: number

  //  异常的坐标
  @Prop({ type: Array, default: () => [] })
  public readonly abnormalTracks!: Array<Array<Array<number>>>

  showInfo = false // 是否显示窗体信息
  showTrack = false // 是否显示轨迹
  zoom: number = MAP.zoom // 初始化缩放大小
  zooms: Array<number> = MAP.zooms // 缩放比例
  realTimeDetail: any = {} // 实时窗体详情
  center: Array<number | string> = MAP.center // 地图中心
  position: Array<number | string> = MAP.center // 地图中心
  havePassedLine: Array<Array<number | string>> = [] // 已经走过的轨迹
  trackLocation: Array<Array<number | string>> = [] //轨迹的坐标系数据
  countPassed: number = 0 // 累积经过了多少个点
  // 地图事件
  events = {
    init: o => {
      o.setZoom
      o.setMapStyle(MAP.mapStyle)
      // 设置高精度图层
      const googleLayer = new AMap.TileLayer({
        getTileUrl: MAP.tileUrl,
        zIndex: 2
      })
      const self = this
      googleLayer.setMap(o)

      // 设置聚合坐标
      self.initMarkerCluster(o)
    }
  }

  // 显示点坐标的条件：
  // 有抽屉 和 显示信息窗体的时候
  get showTrackMarker() {
    return this.showDrawer || this.showInfo
  }
  get trackMarkerContent() {
    const { carDetail } = this
    return Object.keys(carDetail).length ? this.markerTemplate(carDetail) : ''
  }

  // 点坐标的内容
  markerLabelContent(realTimeDetail) {
    const { alarmType } = realTimeDetail
    const type = alarmType ? WARNGING.status[String(alarmType)].label : '无异常'
    const isWarning = !!alarmType
    // 显示内容的判断条件（不显示窗体内容&显示底部抽屉&有点坐标时候）
    const showContent =
      !this.showInfo && this.showDrawer && this.trackMarkers.length
    return {
      content:
        showContent &&
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
        this.showInfo = true // 点击某个点坐标 => 显示信息窗体
      },
      moveend: () => {
        const isNotEuqal = this.trackMarkers.length - 1 !== this.countPassed
        this.setTrackStatus(!isNotEuqal)
        if (isNotEuqal) {
          this.moveToTracker()
        } else {
          // this.showInfo = true // 再次显示信息窗体
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
          if (!this.showInfo) {
            this.showInfo = true
          }
        }, 200)
        this.$emit('load-car-detail', item) // 加载车辆信息详情
      }
    }
  }

  // 点坐标 - 模板
  markerTemplate(carDetail, { show = true } = {}) {
    const { carNo, location, runState, alarmType } = carDetail
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
    this.$emit('play-track', { data: this.carDetail })
  }

  // 轨迹 - 开始播放
  moveTracker() {
    this.moveToTracker()
    this.movingTracker()
    if (this.isEnd) {
      // 隐藏信息窗体
      this.showInfo = false
    }
  }
  // 监听 点坐标正在移动中
  movingTracker() {
    this.marker.$$getInstance().on('moving', e => {
      this.havePassedLine.push(e.passedPath[e.passedPath.length - 1])
    })
  }
  // 轨迹移动
  moveToTracker() {
    const _nextPoint = this.trackMarkers[this.countPassed + 1]
    if (_nextPoint) {
      const { speed, location } = this.trackMarkers[this.countPassed]
      // 下一个坐标的经curr纬度
      const [currLng, currLat] = location.split(',')
      // 下一个坐标的经纬度
      let [nextLng, nextLat] = _nextPoint.location.split(',')
      let _lnglat = new AMap.LngLat(Number(nextLng), Number(nextLat))
      var dis = (AMap as any).GeometryUtil.distance(
        [currLng, currLat],
        [nextLng, nextLat]
      )
      if (!dis) {
        _lnglat = new AMap.LngLat(
          Number(Number(nextLng).toFixed(6)) + 0.000001,
          Number(Number(nextLat).toFixed(6)) + 0.000001
        )
      }
      // 计数加1
      this.countPassed++
      this.setTrackPassedLength(this.countPassed) // 每移动一格加一
      this.realTimeDetail = this.trackMarkers[this.countPassed]
      this.$nextTick(() => {
        this.center = [nextLng, nextLat]
      })
      this.marker.$$getInstance().moveTo(_lnglat, speed * this.speed * 3)
    }
  }

  // 轨迹 - 停止移动
  pauseTracker() {
    this.marker.$$getInstance().pauseMove()
  }

  // 初始化轨迹移动
  initLoadTrack() {
    this.showTrack = !!this.trackMarkers.length // 如果有坐标，则显示轨迹
    // 格式化数据
    this.trackLocation = this.trackMarkers.map(item => item.location.split(','))
    // 每走一个点 中心都发生改变
    setTimeout(() => {
      const { lng, lat } = this.polyline.$$getInstance().getPath()[0]
      if (lng && lat) {
        this.position = this.center = [lng, lat]
      }
    }, 0)
  }

  // 停止移动要把一切设为停止
  stopMove({ reload = true } = {}) {
    this.$emit('stop-move') // 停止移动
    this.havePassedLine = [] // 清空已走过的轨迹
    this.countPassed = 0 // 计数器设默认为1
    this.setTrackPassedLength(0)
    this.$nextTick(() => {
      this.marker.$$getInstance().stopMove()
      reload && this.initLoadTrack() // 初始化路径
    })
  }

  // 监听 - 轨迹
  @Watch('trackMarkers', { deep: true })
  public watchTrackMarkerts(val: Array<CarLocationBody>) {
    this.initLoadTrack()
  }

  // 停止播放
  @Watch('isEnd')
  public watchIsEnd(val) {
    if (val) {
      this.stopMove({ reload: !!this.showDrawer })
    }
  }

  @Watch('isDragging')
  public publicIsDrag(val) {
    val && this.marker.$$getInstance().stopMove()
  }

  // 手动滑
  @Watch('sliderVal', { deep: true })
  public watchSliderVal(val) {
    this.countPassed = val
    this.havePassedLine = this.trackLocation.slice(0, val + 1)
    setTimeout(() => {
      const { location } = this.trackMarkers[this.countPassed]
      this.center = location.split(',')
      this.position = this.center
    }, 0)
    if (this.isPlaying) {
      setTimeout(() => {
        this.moveToTracker()
        this.movingTracker()
      }, 400)
    } else {
      this.realTimeDetail = this.trackMarkers[this.countPassed]
    }
  }

  // 监听 - 是否显示抽屉
  @Watch('showDrawer')
  public watchshowDrawer(val: boolean) {
    if (!val) {
      this.showTrack = false // 不显示轨迹
      this.showInfo = false // 不显示信息窗体
      this.setTrackStatus(true)
      this.$nextTick(() => {
        this.trackLocation = [] //轨迹的总坐标系清空
      })
      this.marker && this.markerCluster.addMarkers(this.markerRefs)
    } else {
      this.marker && this.markerCluster.clearMarkers()
    }
  }

  // 监听 - 轨迹
  @Watch('showTrack', {})
  public watchShowTrack(val: boolean) {
    if (val) {
      // 1. 显示
      this.realTimeDetail = this.trackMarkers[0] // 实时信息
      this.showInfo = false // 把汽车详情隐藏
      this.marker && this.markerCluster.clearMarkers()
    } else {
      this.marker && this.markerCluster.addMarkers(this.markerRefs)
    }
  }

  @Watch('showInfo')
  public watchShowInfo(val: boolean) {
    if (!val) {
      !this.isPlaying &&
        !this.showDrawer &&
        this.marker &&
        this.markerCluster.addMarkers(this.markerRefs)
    }
  }
  // 监听 - 轨迹
  @Watch('carDetail', { deep: true })
  public async watchCarDetail(val) {
    if (val.id) {
      this.initPreTrack(val) // 加载预设路线
      const { alarmType } = val
      setTimeout(() => {
        // 1. 改变地图中心
        this.center = val.location.split(',')
        this.position = this.center
        // this.markerRefs = []
        this.marker && this.markerCluster.clearMarkers()
        this.map.$$getInstance().setZoom(MAP.zoom)
        // 3. 显示信息窗体（分两种情况：）
        // 3.1 如果有alarmNumber，则不显示；没有则显示
        this.showInfo = !val.alarmNumber
      }, 1)
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
