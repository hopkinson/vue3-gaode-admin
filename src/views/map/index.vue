<template>
  <div class="map">
    <!-- 异常信息-->
    <alert-abnormal
      :data="abnormalList"
      @confirm="loadCarDetail"
    ></alert-abnormal>
    <!-- 搜索  -->
    <search-car-status
      v-if="!isFullScreen"
      class="map__chart--search"
      v-model="showSearch"
      :table-data="searchCarBody"
      :company-list="companyList"
      @search="handleSearchCar"
      @current-change="handleCurrentChange"
      @fetch-company="handleSearchCompany"
      @play="loadCarDetail"
      @change-filter="handleChangeFilter"
    ></search-car-status>
    <div class="map__chart--left" v-if="!isFullScreen">
      <!-- 图表 -->
      <panel-chart
        title="告警统计"
        unit="单位（次）"
        :height="240"
        size="big"
        class="map__chart--panel"
      >
        <chart-warning
          :data="warning"
          class="map__chart--inner"
        ></chart-warning>
      </panel-chart>
      <panel-chart
        title="当天最高时速"
        unit="速度（公里/小时）"
        :height="200"
        size="big"
        class="map__chart--panel"
      >
        <chart-speed :data="speed" class="map__chart--inner"></chart-speed>
      </panel-chart>
      <!-- 左下角 - 图例 -->
      <div class="map__legends map__legends--position">
        <div
          v-for="(item, index) in legends"
          :key="index"
          class="map__legends--inner"
        >
          <i class="sprite_ico" :class="[`sprite_ico_pic_${item.value}`]"></i>
          <p>{{ item.label }}</p>
        </div>
      </div>
    </div>
    <div class="map__chart--right" v-if="!isFullScreen">
      <panel-chart
        title="车辆状态"
        :height="194"
        size="small"
        class="map__chart--panel"
      >
        <chart-cars :data="cars"></chart-cars>
      </panel-chart>
      <panel-chart
        title="车辆区域分布"
        unit="单位（辆）"
        size="small"
        :height="212"
      >
        <span slot="link">
          查看更多区域
          <i class="el-icon-arrow-right"></i>
        </span>
        <chart-districts :data="districts"></chart-districts>
      </panel-chart>
    </div>

    <!-- 地图  -->
    <map-home
      :track-markers.sync="trackMarkers"
      :speed="trackSpeed"
      :markers="carList"
      :car-detail="carDetail"
      :isPlaying.sync="isPlaying"
      :passedLength="passedLength"
      :loadPreTrack="loadPreMarkers"
      @on-passed-line="recordPassedLength"
      @load-car-detail="loadCarDetail"
      @play-track="handleShowTrack"
      ref="map"
    ></map-home>
    <!-- 底部 - 抽屉 -->
    <drawer-track
      class="map__drawer"
      :show.sync="showDrawer"
      v-model="passedLength"
      :speed.sync="trackSpeed"
      :track-markers="trackMarkers"
      ref="drawer"
      :is-playing.sync="isPlaying"
      :car-detail="carDetail"
      @play="handleControlTrack"
      @search-track="handleSearchTrack"
    ></drawer-track>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import PanelChart from './modules/Panel/Chart.vue'
import ChartSpeed from './modules/Chart/Speed.vue'
import AlertAbnormal from './modules/Alert/Abnormal.vue'
import ChartDistricts from './modules/Chart/Districts.vue'
import ChartCars from './modules/Chart/Cars.vue'
import ChartWarning from './modules/Chart/Warning.vue'
import DrawerTrack from './modules/Drawer/Track.vue'
import MapHome from './modules/Map/Home.vue'
import { TRAFFIC_LEGEND } from '@/config/dict'
import SearchCarStatus from './modules/Search/CarStatus.vue'
import Websocket from '@/plugins/websocket'
import { warning, cars, districts, speed } from '@/mock/data.js'
import { Getter } from 'vuex-class'
import {
  CompanyBody,
  CarsBodyRecords,
  CarIdBody,
  CarLocationBody,
  CarStateBody
} from '@/services'

@Component({
  name: 'MapIndex',
  components: {
    MapHome,
    PanelChart,
    ChartSpeed,
    ChartCars,
    ChartWarning,
    AlertAbnormal,
    SearchCarStatus,
    ChartDistricts,
    DrawerTrack
  }
})
export default class MapIndex extends Vue {
  @Ref('drawer') drawer: any
  @Ref('map') map: any

  @Getter('app/isFullScreen') isFullScreen
  // 是否在播放轨迹回放
  isPlaying: boolean = false
  // 是否显示抽屉
  showDrawer: boolean = false
  // 是否显示筛选
  showSearch: boolean = false
  // 图例 - 交通状态
  legends = TRAFFIC_LEGEND
  passedLength = 0 // 已经路过的长度
  trackSpeed: number = 20 // 初始化速度
  // 列表 - 时速
  speed: any = []
  districts: any = []
  warning: any = []
  cars = {} // 车辆状态的信息
  carDetail = {} // 汽车详情
  trackMarkers: Array<Array<number>> = [] // 标记点 - 轨迹回放
  companyList: Array<CompanyBody> = [] // 所有单位信息
  searchCarBody = {} // 搜索的车辆列表
  carList: Array<CarLocationBody> = [] // 所有车辆的列表
  interval: number = 0
  abnormalList = [] // 异常信息列表
  websocket: any = null // websocket连接
  carParams = {
    pageNum: '',
    pageNo: 10,
    companyId: '',
    carNo: ''
  }
  async created() {
    await this.pollingLocation()
    setInterval(() => {
      this.pollingLocation()
    }, 30000)
    //订阅websocket消息
    // this.websocket = new Websocket({
    //   endPoint: process.env.VUE_APP_WS_API
    // })
    // this.websocket.subscribes('/socket/topic/alarms', ({ body }) => {
    //   const result = JSON.parse(body)
    //   this.abnormalList = result
    // })
    // 车辆状态
    this.cars = await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/car/state'
    })
    // 最高时速
    this.speed = await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/car/speed'
    })

    // 地区分布
    this.districts = await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/car/distribution'
    })

    // 车辆 - 告警统计
    this.warning = await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/alarms/collect'
    })
  }
  beforeDestroy() {
    clearInterval(this.interval)
    this.interval = 0
    this.websocket.disconnect()
  }
  // 长轮询 - 返回车辆实时位置信息
  async pollingLocation() {
    this.carList = await this.$ajax.ajax({
      method: 'POST',
      url: `v1/car/location`
    })
  }
  // 控制轨迹的播放
  handleControlTrack(isPlaying) {
    console.log('播放状态', isPlaying ? 'pauseTracker' : 'moveTracker')
    this.isPlaying ? this.map.pauseTracker() : this.map.moveTracker()
    this.isPlaying = !this.isPlaying
  }
  // 搜索汽车
  handleSearchCar(carNo) {
    this.carParams = Object.assign({}, this.carParams, {
      carNo,
      pageNum: 0
    })
  }
  // 改变搜索条件
  handleChangeFilter(form) {
    this.carParams = Object.assign({}, this.carParams, {
      ...form,
      pageNum: 0
    })
  }
  // 改变当前页
  handleCurrentChange(pageNum) {
    this.carParams = Object.assign({}, this.carParams, {
      pageNum
    })
  }
  recordPassedLength(val) {
    this.passedLength = val
  }
  // 返回实际轨迹
  async handleSearchTrack(data) {
    this.trackMarkers = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/car/track',
      data: data
    })
  }
  // 加载预设
  async loadPreMarkers(val) {
    return await this.$ajax.ajax({
      method: 'GET',
      url: `v1/route/car/${val.id}`
    })
  }

  // 点击窗体的轨迹回放 - 显示底部抽屉
  handleShowTrack({ realTime }) {
    if (realTime) {
      this.showDrawer = true
    } else {
      this.showDrawer = false
      setTimeout(() => {
        this.showDrawer = true
      }, 200)
    }
  }
  // 所有单位信息
  async handleSearchCompany() {
    return await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/car/company'
    })
  }
  // 加载汽车详情
  async loadCarDetail(item) {
    const { runState, location } = item
    this.trackMarkers = []
    this.isPlaying = false
    if (runState !== 3 || (location && location.runState !== 3)) {
      this.carDetail = await this.$ajax.ajax({
        method: 'GET',
        url: `v1/car/${item.id}`
      })
    } else {
      const data = await this.$ajax.ajax({
        method: 'GET',
        url: `v1/alarms/${item.id}`
      })
      this.carDetail = {
        id: item.id || 0,
        carNo: data.carNo,
        terminalNo: item.terminalNo || 0,
        companyId: '',
        companyName: data.companyName,
        name: '',
        typeId: '',
        typeName: '',
        model: '',
        location: {
          alarmType: data.type,
          location: data.location,
          speed: data.speed,
          direction: data.direction,
          locateTime: data.alarmTime,
          runState: 3
        }
      }
    }
  }

  // 监听 - 倍速
  @Watch('showSearch', {})
  public async watchShowSearch(val: boolean) {
    if (val && !this.companyList.length) {
      // 所有单位信息
      this.companyList = await this.$ajax.ajax({
        method: 'GET',
        url: 'v1/company'
      })
      this.carParams.pageNum = '0'
    }
  }

  @Watch('carParams', { deep: true })
  public async watchCarParams(val) {
    // 车辆列表
    const carBody = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/cars',
      query: val,
      data: val
    })
    this.searchCarBody = carBody
  }
}
</script>

<style lang="less" scoped>
.map {
  height: 100%;
  &__chart {
    &--search {
      position: fixed;
      top: 148px;
      z-index: 99;
      left: 30px;
    }
    &--left,
    &--right {
      z-index: 1;
      position: fixed;
      top: 148px;
      bottom: 0;
    }
    &--left {
      top: 200px;
      left: 30px;
    }
    &--right {
      right: 28px;
      top: 250px;
    }
    &--panel {
      margin-bottom: 20px;
      position: relative;
    }
    &--inner {
      position: absolute;
      bottom: -6px;
    }
  }
  &__drawer {
    position: static !important;
    & /deep/ .el-drawer__container {
      position: fixed;
      top: auto;
      height: auto;
      z-index: 2000;
    }
  }
  &__legends {
    display: flex;
    align-items: center;
    color: rgb(255, 255, 255);
    font-size: 12px;
    &--position {
      position: fixed;
      bottom: 50px;
    }
    &--inner {
      margin-right: 20px;
      text-align: center;
    }
  }
}
.tooltip-bar {
  background-color: #22a8ee;
  border-radius: 2px;
  position: relative;
  color: #fff;
  font-weight: bold;
  padding-left: 4px;
  font-size: 12px;
  &:after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid dashed dashed;
    border-color: #22a8ee transparent transparent;
  }
}
</style>
