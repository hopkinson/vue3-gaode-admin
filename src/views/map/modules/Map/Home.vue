<template>
  <section class="maphome">
    {{ speed }}
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
      <!-- 点坐标 - 用户动画播放 :content="
          
        " -->
      <el-amap-marker
        ref="marker"
        :visible="showDrawer || showInfo"
        :events="trackMarkerEvent(carDetail)"
        :position="position"
        :offset="carDetail.alarmType ? [-26, -135] : [-26, -103]"
        :content="
          Object.keys(carDetail).length ? markerTemplate(carDetail) : ''
        "
      ></el-amap-marker>
      <el-amap-polyline
        :path="normalTracks.total"
        strokeColor="#fff000"
      ></el-amap-polyline>
      <el-amap-polyline
        :path="abnormalTracks.total"
        strokeColor="#ff010b"
      ></el-amap-polyline>
      <el-amap-polyline
        :path="trackLocation"
        ref="polyline"
        strokeColor="transparent"
      ></el-amap-polyline>
      <el-amap-polyline
        :path="havePassedLine"
        strokeColor="#435a70"
      ></el-amap-polyline>
      <el-amap-polyline
        :path="newhavePassedLine"
        strokeColor="#435a70"
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
  PropSync
} from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import PanelCarDetail from '../Panel/CarDetail.vue'
import { CarIdBody, CarLocationBody } from '@/services'
import { TRAFFIC_LEGEND, WARNGING } from '@/config/dict'
interface TrackCatagelory {
  total: Array<Array<number | string>>
  nopassed: Array<Array<number | string>>
}
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
export default class MapHome extends Vue {
  @Ref('marker') marker: any
  @Ref('map') map: any
  @Ref('polyline') polyline: any
  @Ref('passedPolyline') passedPolyline: any

  // 是否正在播放 .sync
  @Prop({ type: Boolean, default: false })
  isPlay!: boolean

  // 是否正在播放 .sync
  @Prop({ type: Boolean, default: false })
  isEnd!: boolean

  //  坐标数组
  @PropSync('trackMarkers', { type: Array, default: () => [] })
  getTrackMarkers!: Array<CarLocationBody>

  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly markers!: Array<any>

  // 是否显示抽屉（用于轨迹回放）
  @Prop({ type: Boolean, default: false })
  public readonly showDrawer!: boolean

  // 获取已经经过点的长度
  @PropSync('passedLength', { type: Number, default: 0 })
  getPassedLength!: number

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
  havePassedLine: Array<Array<number | string>> = [] // 已经走过的轨迹
  trackLocation: Array<Array<number | string>> = [] //轨迹的坐标系数据
  originTrack: Array<Array<number | string>> = [] // 原始轨迹坐标系的备份
  noPassedLine: Array<Array<number | string>> = [] // 将未运动的点变成新的点
  newhavePassedLine: Array<Array<number | string>> = [] // 将未运动的点变成新的点
  hasChangeSpeed: boolean = false // 是否有改过速度
  hadCountLength: boolean = false
  //轨迹的坐标系（无警告）
  normalTracks: TrackCatagelory = {
    total: [],
    nopassed: []
  }
  //轨迹的坐标系（有警告）
  abnormalTracks: TrackCatagelory = {
    total: [],
    nopassed: []
  }
  passedLineLength: number = 0 // 获取已经经过点的长度
  mouseTool: any = {} //注册全局绘制围栏插件实例
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
      // console.log(o)
    }
  }

  // 返回来的电子围栏的路径
  fencepath(item) {
    return item ? item.split(';').map(i => i.split(',')) : []
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
      let fenceArr: any = []
      //画出来的坐标放在存放在数组里面
      e.obj.getPath().forEach(path => {
        const { lng, lat } = path
        fenceArr.push([lng, lat])
      })
      this.$confirm('是否将绘制的范围添加到电子围栏里？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('add-fence', fenceArr)
        })
        .catch(() => {
          this.destroyMouseTool()
        })
    })
  }
  // 关闭绘图插件 清除你之前画的图像
  destroyMouseTool() {
    this.mouseTool.close(true)
    this.fence = []
  }

  // showToolPolygon() {
  //   this.
  // }

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
    this.moveToTracker()
    this.realTime = true
    // if (!this.realTime) {

    // } else {
    //   // this.marker.$$getInstance().resumeMove()
    // }
  }
  moveToTracker() {
    const { location } = this.getTrackMarkers.slice(0, 10)[this.countPassed + 1]
    const { speed } = this.getTrackMarkers.slice(0, 10)[this.countPassed]
    if (location) {
      const _location: Array<number | string> = location.split(',')
      const _lnglat = new AMap.LngLat(
        Number(_location[0]),
        Number(_location[1])
      )

      this.marker.$$getInstance().moveTo(_lnglat, speed, k => {
        if (this.getTrackMarkers.slice(0, 10).length !== this.countPassed) {
          this.countPassed++
          // this.moveTracker()
          // console.log(this.countPassed)
        }
        // console.log(self.countPassed)
        return k
      })
    }
    // this.marker.$$getInstance().moveTo(_lnglat, Number(speed), k => {
    //   console.log(k)
    //   this.countPassed++
    //   this.moveTracker()
    //   return k
    // })
    // }
  }
  // // 轨迹 - 停止移动
  pauseTracker() {
    // this.moveToTracker()
  }

  // 初始化轨迹移动
  initLoadTrack() {
    this.abnormalTracks.total = this.normalTracks.total = []
    // 分是否警告去显示经纬度
    this.getTrackMarkers.slice(0, 10).forEach(item => {
      if (item.alarmType) {
        this.abnormalTracks.total.push(item.location.split(',')) // 警告的经纬度数组
      } else {
        this.normalTracks.total.push(item.location.split(',')) // 无警告的经纬度数组
      }
    })
    // 格式化数据
    this.trackLocation = this.getTrackMarkers.map(item =>
      item.location.split(',')
    )
    // this.originTrack = this.trackLocation
    // 每走一个点 中心都发生改变
    setTimeout(() => {
      const { lng, lat } = this.polyline.$$getInstance().getPath()[0]
      this.position = this.center = [lng, lat]
    }, 0)
    // this.marker.$$getInstance().on('moving', e => {
    //   if (!this.hasChangeSpeed) {
    //     this.realTimeDetail = this.getTrackMarkers[e.passedPath.length - 1]
    //     this.$emit('update:passedLength', e.passedPath.length)
    //     //已经经过的点
    //     this.havePassedLine = e.passedPath
    //     setTimeout(() => {
    //       const accro = e.passedPath[e.passedPath.length - 1]
    //       this.position = [accro.lng, accro.lat]
    //       this.center = this.position
    //     }, 0)
    //   }
    // })
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
    }, 200)
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

  // 监听 - 是否显示抽屉
  @Watch('showDrawer', {})
  public watchshowDrawer(val: boolean) {
    if (!val) {
      this.havePassedLine = [] // 已经走过的轨迹
      this.trackLocation = [] //轨迹的总坐标系
      this.originTrack = [] // 原始轨迹坐标系的备份
      this.noPassedLine = [] // 将未运动的点变成新的点
      //轨迹的坐标系（无警告）
      this.normalTracks = {
        total: [],
        nopassed: []
      }
      //轨迹的坐标系（有警告）
      this.abnormalTracks = {
        total: [],
        nopassed: []
      }
      this.passedLineLength = 0 // 获取已经经过点的长度
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
  @Watch('carDetail', { deep: true })
  public async watchCarDetail(val: CarLocationBody) {
    if (Object.keys(val).length) {
      this.preMarkers = await this.loadPreTrack(val) // 加载预设轨迹
      const { alarmType } = val
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

  // 监听 - 倍速
  @Watch('speed', {})
  public watchSpeed(newVal: number) {
    this.hasChangeSpeed = true
    this.marker.$$getInstance().pauseMove()
    this.havePassedLine = this.originTrack.slice(
      0,
      this.newhavePassedLine.length + this.havePassedLine.length
    )
    this.$nextTick(() => {})
    this.marker.$$getInstance().on('moving', e => {
      this.newhavePassedLine = e.passedPath
      const _passedLength = this.havePassedLine.length + e.passedPath.length
      this.$emit('update:passedLength', _passedLength)
      setTimeout(() => {
        const accro = e.passedPath[e.passedPath.length - 1]
        // 播完了
        if (this.getTrackMarkers.length === this.getPassedLength) {
          this.realTime = false
        }
        this.position = [accro.lng, accro.lat]
        this.center = this.position
      }, 0)
    })

    // 绘制轨迹---未运动时候的样式
    setTimeout(() => {
      // 截取未运动的点
      const _noPassedLine = this.getTrackMarkers.slice(
        this.havePassedLine.length
      )
      // 将未运动的点变成新的点
      this.trackLocation = _noPassedLine.map(item => item.location.split(','))
      this.$nextTick(() => {
        this.marker.$$getInstance().moveAlong(this.trackLocation, newVal)
      })
    }, 0)
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
