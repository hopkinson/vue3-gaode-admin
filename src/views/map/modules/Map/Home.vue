<template>
  <section class="maphome">
    {{ fence }}
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
      :plugin="plugin"
    >
      <!-- 多边形 - 围栏列表 -->
      <el-amap-polygon
        :path="fence"
        fillColor="rgb(55, 70, 95)"
        strokeColor="rgb(0, 140, 255)"
        strokeStyle="dashed"
        :strokeWeight="2"
        :event="polygonEvent"
        :fillOpacity="0.4"
      ></el-amap-polygon>
      <!-- <el-amap-polygon
        v-for="(polygon, index) in polygons"
        :key="index"
        :path="polygon.path"
      ></el-amap-polygon> -->
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
          v-model="showInfo"
          :data="realTime ? realTimeDetail : carDetail"
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
      <!-- 点坐标 - 用户动画播放 -->
      <el-amap-marker
        ref="marker"
        :offset="[-26, -103]"
        :visible="showTrack"
        :events="trackMarkerEvent(carDetail)"
        :content="
          Object.keys(carDetail).length ? markerTemplate(carDetail) : ''
        "
        :position="position"
      ></el-amap-marker>
      <!-- 折线 - 预设路线 -->
      <!-- <el-amap-polyline :path="polyline.path"></el-amap-polyline> -->
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
  PropSync
} from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import PanelCarDetail from '../Panel/CarDetail.vue'
import { CarIdBody, CarIdBodyLocation } from '@/services'
import { TRAFFIC_LEGEND, WARNGING } from '@/config/dict'

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
  @Ref('passedPolyline') passedPolyline: any

  // 是否正在播放 .sync
  @Prop({ type: Boolean, default: false })
  isPlay!: boolean

  // 是否正在播放 .sync
  @Prop({ type: Boolean, default: false })
  isEnd!: boolean

  //  坐标数组
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

  //  点击详情显示地图中心
  @Prop({ type: Array, default: [] })
  public readonly mapCenter!: Array<number | string>

  //  请求预设轨迹的接口
  @Prop({ type: Function, default: () => {} })
  public readonly loadPreTrack!: Function

  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Function, default: () => {} })
  public readonly fetchCarDetail!: Function
  // 汽车详情
  @Prop({ type: Object, default: () => {} })
  public readonly carDetail!: CarIdBody
  // 围栏列表坐标
  @Prop({ type: Array, default: () => [] })
  public readonly fenceList!: Array<any>

  showInfo = false // 是否显示窗体信息
  showTrack = false // 是否显示轨迹
  realTime = false
  zoom: number = MAP.zoom // 初始化缩放大小
  zooms: Array<number> = MAP.zooms // 缩放比例
  realTimeDetail = {} // 实时窗体详情
  center: Array<number | string> = MAP.center // 地图中心
  position: Array<number | string> = MAP.center // 地图中心
  markerRefs: any = [] // 点聚合
  fence: Array<Array<number>> = [] // 围栏坐标
  preMarkers: Array<Array<number>> = [] // 预设轨迹
  havePassedLine: Array<Array<number>> = [] // 已经走过的轨迹
  originTrack: Array<Array<number | string>> = [] // 原始数据// 备份
  NoPassedLine: Array<Array<number | string>> = [] // 将未运动的点变成新的点
  plugin: Array<string> = ['PolyEditor', 'MarkerClusterer', 'InfoWindow']
  isAbnormal: boolean = false // 是否属于异常
  trackLocation: Array<Array<number | string>> = [] //轨迹的坐标系
  passedLineLength: number = 0 // 获取已经经过点的长度
  mouseTool: any = {} //注册全局绘制围栏插件实例
  polyline: any = {}
  newPolyline: any = {}
  // 地图事件
  events = {
    init: o => {
      o.setMapStyle(MAP.mapStyle)
      // 设置高精度图层
      const googleLayer = new AMap.TileLayer({
        getTileUrl: MAP.tileUrl,
        zIndex: 2
      })
      googleLayer.setMap(o)
      const self = this
      // 设置聚合坐标
      setTimeout(() => {
        let cluster = new (AMap as any).MarkerClusterer(o, self.markerRefs, {
          gridSize: 60,
          renderCluserMarker: context => {
            const count = self.markers.length
            let size = Math.round(
              30 + Math.pow(context.count / count, 1 / 5) * 20
            )
            const result = `
            <div class="project__map-cluserMarker">
              <i class="sprite_ico sprite_ico_focus_car">
                <div class="circle"></div>
                <span>${context.count}</span>
              </i>
            </div>`
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
            context.marker.setContent(result)
          }
        })
      }, 1000)
    }
  }

  polygonEvent = {
    click: o => {
      console.log(o)
    }
  }
  // 轨迹点坐标事件
  trackMarkerEvent(detail) {
    return {
      click: () => {
        if (!this.realTime) {
          setTimeout(() => {
            this.realTime = false
            this.showInfo = true
          }, 200)
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

  // 引入绘图插件  全局调用绘图插件
  initMouseTool() {
    this.mouseTool = new (AMap as any).MouseTool(this.map.$$getInstance())
    this.mouseTool.polygon({
      fillColor: 'rgb(55, 70, 95)',
      strokeColor: 'rgb(0, 140, 255)',
      strokeStyle: 'dashed',
      strokeWeight: 2,
      fillOpacity: 0.4
    })
    //监听draw事件可获取画好的覆盖物
    this.mouseTool.on('draw', e => {
      //每次只能传四个点，所以先清空
      this.fence = []
      //画出来的坐标放在存放在数组里面
      e.obj.getPath().forEach(({ lng, lat }) => {
        this.$confirm('是否将绘制的范围添加到电子围栏里？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.fence.push([lng, lat])
            this.$emit('add-fence', this.fence)
          })
          .catch(() => {
            this.fence = []
          })
      })
    })
  }
  // 关闭绘图插件 清除你之前画的图像
  destroyMouseTool() {
    this.mouseTool.close(true)
    this.fence = []
  }

  showToolPolygon() {}

  // 点坐标 - 模板
  markerTemplate({ carNo, location: { runState, alarmType } }) {
    return `
  <div class="project__map-marker">
    <i class="sprite_ico sprite_ico_icon_${runState === 3 &&
      !!alarmType &&
      WARNGING.status[alarmType.toString()].value}" style="display:${
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
      if (!this.realTime) {
        this.marker.$$getInstance().moveAlong(this.trackLocation, this.speed)
        this.realTime = true
      } else {
        this.marker.$$getInstance().resumeMove()
      }
    })
  }

  // 轨迹 - 停止移动
  pauseTracker() {
    this.marker.$$getInstance().pauseMove()
  }

  // 初始化轨迹移动
  initLoadTrack() {
    this.polyline = new (AMap as any).Polyline({
      map: this.map.$$getInstance(),
      path: this.trackLocation,
      strokeColor: !this.isAbnormal ? '#fff000' : '#ff010b'
    })
    //绘制运动过了的轨迹
    const passedPolyline = new (AMap as any).Polyline({
      map: this.map.$$getInstance(),
      strokeColor: '#435a70'
    })
    setTimeout(() => {
      const { lng, lat } = this.polyline.getPath()[0]
      this.position = this.center = [lng, lat]
    }, 0)
    this.marker.$$getInstance().on('moving', e => {
      this.realTimeDetail = this.getTrackMarkers[e.passedPath.length - 1]
      // 获取已经经过点的长度
      this.$emit('on-passed-line', {
        passed: e.passedPath.length,
        total: e.passedPath.length,
        data: this.trackLocation
      })
      //已经经过的点
      this.havePassedLine = e.passedPath
      //绘制路过了的轨迹
      passedPolyline.setPath(e.passedPath)
      setTimeout(() => {
        const accro = e.passedPath[e.passedPath.length - 1]
        this.position = [accro.lng, accro.lat]
        this.center = this.position
      }, 0)
    })
  }
  // 停止移动要把一切设为停止
  stopMove() {
    this.$emit('stop-move')
    this.$nextTick(() => {
      this.marker.$$getInstance().stopMove()
    })
    this.realTime = false
    setTimeout(() => {
      this.trackLocation = this.originTrack
      this.initLoadTrack()
      // this.marker.$$getInstance().moveAlong(this.trackLocation, this.speed)
    }, 200)
  }
  // 监听 - 轨迹
  @Watch('getTrackMarkers', { deep: true })
  public watchTrackMarkerts(val: Array<CarIdBodyLocation>) {
    this.showTrack = !!val && !!val.length // 如果有坐标，则显示轨迹
    if (val.length) {
      this.trackLocation = val.map(item => item.location.split(','))
      this.originTrack = this.trackLocation // 备份
      this.initLoadTrack()
    }
  }
  @Watch('isEnd', {})
  public watchIsEnd(val) {
    if (val) {
      this.stopMove()
    }
  }

  // 监听 - 轨迹
  @Watch('showTrack', {})
  public watchShowTrack(val: boolean) {
    if (val) {
      this.realTimeDetail = this.getTrackMarkers[0] // 实时信息
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
        this.center = this.mapCenter
        this.position = this.center
        this.realTime = false
        this.showInfo = true
        this.map.$$getInstance().setZoom(19)
      }, 350)
    }
  }

  // 监听 - 是否实时播放
  @Watch('realTime', {})
  public watchRealTime(val: number) {
    if (!val) {
      this.stopMove()
    }
  }

  // 监听 - 滑动
  // @Watch('passedLength', {})
  // public watchpassedLength(val: number) {
  //   if (!this.isPlay) {
  //     this.$nextTick(() => {
  //       this.marker.$$getInstance().pauseMove()
  //       this.marker.$$getInstance().moveAlong(this.trackLocation[val], 0)
  //     })
  //   }
  // }

  // 监听 - 倍速
  @Watch('speed', {})
  public watchSpeed(newVal: number) {
    this.marker.$$getInstance().pauseMove()
    new (AMap as any).Polyline({
      map: this.map.$$getInstance(),
      path: this.havePassedLine,
      strokeColor: '#435a70'
    })
    // 截取未运动的点
    this.NoPassedLine = this.trackLocation.slice(this.passedLength)
    // 将未运动的点变成新的点
    this.trackLocation = this.NoPassedLine
    // 绘制轨迹---未运动时候的样式
    this.newPolyline = new (AMap as any).Polyline({
      map: this.map.$$getInstance(),
      path: this.NoPassedLine,
      strokeColor: !this.isAbnormal ? '#fff000' : '#ff010b'
    })
    //绘制运动过了的轨迹
    var newPassedPolyline = new (AMap as any).Polyline({
      map: this.map.$$getInstance(),
      strokeColor: '#435a70'
    })
    this.$nextTick(() => {
      this.passedLineLength = this.passedLineLength + this.passedLength
    })
    this.marker.$$getInstance().on('moving', e => {
      this.$emit('on-passed-line', {
        passed: e.passedPath.length,
        total: this.havePassedLine.length + this.passedLineLength,
        data: this.getTrackMarkers.length
      })
      newPassedPolyline.setPath(e.passedPath)
      setTimeout(() => {
        const accro = e.passedPath[e.passedPath.length - 1]
        // 播完了
        if (
          this.getTrackMarkers.length ===
          this.havePassedLine.length + this.passedLineLength
        ) {
          this.realTime = false
        }
        this.position = [accro.lng, accro.lat]
        this.center = this.position
      }, 0)
    })
    this.$nextTick(() => {
      this.marker.$$getInstance().moveAlong(this.NoPassedLine, newVal)
    })
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
