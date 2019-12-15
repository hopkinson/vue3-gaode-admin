<template>
  <div class="map">
    <!-- 图表 && 查询 -->
    <!-- 搜索  -->
    <search-car-status
      class="map__chart--search"
      v-model="showSearch"
    ></search-car-status>
    <div class="map__chart--left">
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
        unit="速度km/h"
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
    <div class="map__chart--right">
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

    <!-- 地图 -->
    <map-home
      :track-markers="trackMarkers"
      :speed="trackSpeed"
      ref="map"
    ></map-home>
    <!-- 底部 - 抽屉 -->
    <drawer-track
      v-model="showDrawer"
      :speed.sync="trackSpeed"
      ref="drawer"
      @play="handleControlTrack"
    ></drawer-track>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import PanelChart from './modules/Panel/Chart.vue'
import ChartSpeed from './modules/Chart/Speed.vue'
import ChartDistricts from './modules/Chart/Districts.vue'
import ChartCars from './modules/Chart/Cars.vue'
import ChartWarning from './modules/Chart/Warning.vue'
import DrawerTrack from './modules/Drawer/Track.vue'
import MapHome from './modules/Map/Home.vue'
import { TRAFFIC_LEGEND } from '@/config/dict'
import SearchCarStatus from './modules/Search/CarStatus.vue'
import trackMarkers from '@/mock/data.js'
import { CompanyBody, CarsBodyRecords, CarIdBody } from '@/services'
@Component({
  name: 'MapIndex',
  components: {
    MapHome,
    PanelChart,
    ChartSpeed,
    ChartCars,
    ChartWarning,
    SearchCarStatus,
    ChartDistricts,
    DrawerTrack
  }
})
export default class MapIndex extends Vue {
  @Ref('drawer') drawer: any
  @Ref('map') map: any
  // 是否显示抽屉
  showDrawer: boolean = false
  // 是否显示筛选
  showSearch: boolean = false
  // 图例 - 交通状态
  legends = TRAFFIC_LEGEND
  trackSpeed: number = 0
  // 列表 - 时速
  speed: any = []
  districts: any = []
  warning: any = []
  cars: any = []
  trackMarkers: Array<Array<number>> = [] // 标记点 - 轨迹回放
  companyList: Array<CompanyBody> = [] // 所有单位信息
  carList: Array<CarsBodyRecords> = [] // 车辆列表
  async created() {
    this.trackMarkers = trackMarkers
    // 车辆 - 告警统计
    this.warning = await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/alerts'
    })
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
    // 街道
  }

  // 控制轨迹的播放
  handleControlTrack(isPlaying) {
    isPlaying ? this.map.pauseTracker() : this.map.moveTracker()
  }

  // 监听 - 倍速
  @Watch('showSearch', {})
  public async watchShowSearch(val: boolean) {
    if (val && !this.companyList.length) {
      // 车辆列表
      if (!this.carList.length) {
        const { records } = await this.$ajax.ajax({
          method: 'POST',
          url: 'v1/car',
          data: {
            pageNum: 0,
            pageNo: 9999
          }
        })
        this.carList = records
      }
      // 所有单位信息
      this.companyList = await this.$ajax.ajax({
        method: 'GET',
        url: 'v1/car/company'
      })
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
