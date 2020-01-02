<template>
  <layout :footer="false" :breadcrumb="false">
    <div class="map">
      <!-- 1. 警告信息-->
      <alert-abnormal
        :num="abnormalNum"
        @click="showAbnormalList"
      ></alert-abnormal>
      <!-- 2. 搜索  -->
      <search-car-status
        v-show="showCharts"
        v-if="!isFullScreen"
        class="map__chart--search"
        v-model="showSearch"
        :table-data="searchCarBody"
        :company-list="companyList"
        @search="handleSearchCar"
        @current-change="handleCurrentChange"
        @fetch-company="handleSearchCompany"
        @play="filterLoadCarDetail"
        @change-filter="handleChangeFilter"
      ></search-car-status>
      <!-- 3. 左侧 -->
      <div class="map__chart--left" v-if="!isFullScreen" v-show="showCharts">
        <!-- 3.1 左侧-图表 -->
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
        <!-- 3.2 左侧-图例 -->
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
      <!-- 4.右侧 -->
      <div class="map__chart--right" v-if="!isFullScreen" v-show="showCharts">
        <!-- 4.1右侧-图表 -->
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
        <!-- 4.2右侧-围栏按钮 -->
        <button-fence
          @add="addFence"
          @close="closeFence"
          :fence.sync="fenceList"
        ></button-fence>
      </div>

      <!-- 地图 :loadPreTrack="loadPreMarkers" @on-passed-line="recordPassedLength" -->
      <map-home
        :track-markers.sync="trackMarkers"
        :slider-val="sliderTrack"
        :speed="trackSpeed"
        :markers="carList"
        :car-detail="carDetail"
        :isPlay="isPlaying"
        :showDrawer="showTrackDrawer"
        :isEnd.sync="isEnd"
        :passedLength.sync="passedLength"
        :fenceList="fenceList"
        @stop-move="stopMoveTracker"
        @add-fence="createFence"
        @load-car-detail="loadCarDetail"
        @play-track="handleShowTrack"
        @close-info-window="closeInfoWindow"
        ref="map"
      ></map-home>
      <!-- 底部 - 抽屉 -->
      <drawer-track
        class="map__drawer--track"
        :show.sync="showTrackDrawer"
        :speed.sync="trackSpeed"
        :track-form="trackForm"
        v-model="passedLength"
        :trackMarkersLength="trackMarkers.length"
        ref="drawer"
        :isEnd="isEnd"
        :isPlaying.sync="isPlaying"
        :car-detail="carDetail"
        @play="handleControlTrack"
        @stop="stopTrack"
        @search-track="handleSearchTrack"
        @change-slider="handleChangeSlider"
      ></drawer-track>
      <!-- 右侧 - 抽屉 -->
      <drawer-abnormal
        class="map__drawer--abnormal"
        :show.sync="showAbnormalDrawer"
        :data="abnormalBody"
        @more="goToQuery"
        @current-change="abnormalCurrentChange"
        @click="showAbnormalDetail"
      ></drawer-abnormal>
    </div>
  </layout>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Mixins } from 'vue-property-decorator'
import PanelChart from './modules/Panel/Chart.vue'
import Layout from '@/layouts/default.vue'
import ChartSpeed from './modules/Chart/Speed.vue'
import AlertAbnormal from './modules/Alert/Abnormal.vue'
import ChartDistricts from './modules/Chart/Districts.vue'
import ChartCars from './modules/Chart/Cars.vue'
import ChartWarning from './modules/Chart/Warning.vue'
import DrawerTrack from './modules/Drawer/Track.vue'
import DrawerAbnormal from './modules/Drawer/Abnormal.vue'
import ButtonFence from './modules/Button/Fence.vue'
import MapHome from './modules/Map/Home.vue'
import { TRAFFIC_LEGEND } from '@/config/dict'
import SearchCarStatus from './modules/Search/CarStatus.vue'
import { Getter } from 'vuex-class'
import MixinsAbnormalList from './mixins/AbnormalList'
import MixinsFence from './mixins/Fence'
import MixinsChart from './mixins/Chart'
import MixinsCars from './mixins/Cars'
import MixinsSearchCar from './mixins/SearchCar'
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
    ButtonFence,
    ChartWarning,
    Layout,
    AlertAbnormal,
    DrawerAbnormal,
    SearchCarStatus,
    ChartDistricts,
    DrawerTrack
  }
})
export default class MapIndex extends Mixins(
  MixinsAbnormalList,
  MixinsChart,
  MixinsCars,
  MixinsSearchCar,
  MixinsFence
) {
  @Ref('drawer') drawer: any
  @Ref('map') map: any

  @Getter('app/isFullScreen') isFullScreen
  // 是否在播放轨迹回放
  isPlaying: boolean = false

  isEnd: boolean = false // 是否停止播放
  showTrackDrawer: boolean = false // 是否显示底部抽屉（轨迹）

  legends = TRAFFIC_LEGEND // 图例 - 交通状态
  passedLength = 0 // 已经路过的长度
  trackSpeed: number = 1 // 初始化速度
  sliderTrack: number = 0 // 滑块的值

  carDetail = {} // 汽车详情

  trackMarkers: Array<Array<number>> = [] // 标记点 - 轨迹回放

  // 显示图表的条件
  get showCharts() {
    return !this.showTrackDrawer && !this.showAbnormalDrawer
  }

  // 控制轨迹的播放
  handleControlTrack(isPlaying) {
    this.isPlaying ? this.map.pauseTracker() : this.map.moveTracker()
    this.isPlaying = !this.isPlaying
    this.isEnd = false
  }

  // 停止轨迹的播放
  stopTrack() {
    this.isEnd = true
  }

  // 返回实际轨迹
  async handleSearchTrack(data) {
    const tracks = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/car/track',
      data: data
    })
    this.trackMarkers = tracks || []
    if (!this.trackMarkers.length) {
      this.$message({
        message: '没有任何轨迹',
        type: 'warning'
      })
    }
  }
  closeInfoWindow() {
    this.showTrackDrawer = false
  }
  // 滑块发生改变时
  handleChangeSlider(val) {
    this.sliderTrack = val
    this.passedLength = val
  }
  // 停止移动轨迹
  stopMoveTracker() {
    this.isPlaying = false
    this.trackSpeed = 1
  }
  // 点击窗体的轨迹回放 - 显示底部抽屉
  handleShowTrack({ realTime }) {
    this.showTrackDrawer = true
  }

  // 点击车辆 => 根据实时车辆信息过滤
  filterLoadCarDetail(item) {
    const car = this.carList.filter(v => item.id === v.id)[0]
    if (!car.location) {
      this.$message({
        message: '没有找到该车辆的实时位置',
        type: 'warning'
      })
      return
    }
    this.loadCarDetail(car)
  }

  // 加载汽车详情
  async loadCarDetail(item) {
    const { runState, location } = item
    this.trackMarkers = []
    this.isPlaying = false
    this.carDetail = item
  }

  @Watch('showTrackDrawer', {})
  public watchShowTrackDrawer(val) {
    if (!val) {
      // 汽车详情清空
      this.carDetail = Object.assign({}, this.carDetail, {
        id: ''
      })
      // 轨迹表单也清空
      this.trackForm = {
        carId: '',
        beginTime: '',
        endTime: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.map {
  height: 100%;
  &__chart {
    &--search {
      position: fixed;
      top: 90px;
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
      top: 150px;
      left: 30px;
    }
    &--right {
      right: 28px;
      top: 150px;
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
    &--track {
      position: static !important;
      & /deep/ .el-drawer__container {
        position: fixed;
        top: auto;
        height: auto;
        z-index: 2000;
      }
    }
    &--abnormal {
      position: static !important;
      & /deep/ .el-drawer {
        background: #020215;
      }
      & /deep/ .el-drawer__container {
        position: fixed;
        top: 60px;
        height: auto;
        z-index: 2000;
      }
    }
  }
  &__legends {
    display: flex;
    align-items: center;
    color: rgb(255, 255, 255);
    font-size: 12px;
    &--position {
      position: fixed;
      bottom: 20px;
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
