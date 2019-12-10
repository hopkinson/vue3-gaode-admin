<template>
  <div class="map">
    <!-- 图表 && 查询 -->
    <div class="map__chart">
      <!-- 左边 -->
      <div class="map__chart--left">
        <panel-chart title="告警统计" unit="单位（次）">
          <chart-warning :data="warning"></chart-warning>
        </panel-chart>
        <panel-chart title="当天最高时速" unit="速度km/h">
          <chart-speed :data="speed"></chart-speed>
        </panel-chart>
        <!-- 左边 - 底部图例 -->
        <div class="map__legends map__legends--position">
          <div
            v-for="(item, index) in legends"
            :key="index"
            class="map__legends--inner"
          >
            <img :src="`/images/pic_${item.value}.png`" :alt="item.label" />
            <p>{{ item.label }}</p>
          </div>
        </div>
      </div>
      <div class="map__chart--right">
        <panel-chart title="车辆状态">
          <chart-cars :data="cars"></chart-cars>
        </panel-chart>
        <panel-chart title="车辆区域分布" unit="单位（辆）">
          <span slot="link">
            查看更多区域
            <i class="el-icon-arrow-right"></i>
          </span>
          <chart-districts :data="districts"></chart-districts>
        </panel-chart>
      </div>
    </div>
    <!-- 地图 -->
    <map-home></map-home>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PanelChart from './modules/Panel/Chart.vue'
import ChartSpeed from './modules/Chart/Speed.vue'
import ChartDistricts from './modules/Chart/Districts.vue'
import ChartCars from './modules/Chart/Cars.vue'
import ChartWarning from './modules/Chart/Warning.vue'
import MapHome from './modules/Map/Home.vue'
import { TRAFFIC_LEGEND } from '@/config/dict'
@Component({
  name: 'MapIndex',
  components: {
    MapHome,
    PanelChart,
    ChartSpeed,
    ChartCars,
    ChartWarning,
    ChartDistricts
  }
})
export default class MapIndex extends Vue {
  // 图例 - 交通状态
  legends = TRAFFIC_LEGEND
  // 列表 - 时速
  speed: any = []
  districts: any = []
  warning: any = []
  cars: any = []
  created() {
    this.warning = []
    this.cars = []
    // 最高时速
    this.speed = [
      {
        carNo: '粤A88888',
        carId: 123,
        speed: 120
      },
      {
        carNo: '粤AKL562',
        carId: 12,
        speed: 60
      },
      {
        carNo: '粤AKLD62',
        carId: 188,
        speed: 67
      },
      {
        carNo: '粤A88772',
        carId: 19,
        speed: 90
      },
      {
        carNo: '粤AKL512',
        carId: 22,
        speed: 80
      }
    ]
    // 地区分布
    this.districts = [
      {
        regionName: '黄埔',
        quantity: 1
      },
      {
        regionName: '黄埔qu',
        quantity: 121
      },
      {
        regionName: '黄11埔qu',
        quantity: 122
      },
      {
        regionName: '黄gg埔qu',
        quantity: 126
      },
      {
        regionName: '黄埔qu111',
        quantity: 144
      },
      {
        regionName: '黄gg埔1qu',
        quantity: 129
      },
      {
        regionName: '黄埔33qu111',
        quantity: 12
      }
    ]
  }
}
</script>

<style lang="less" scoped>
.map {
  height: 100%;
  &__chart {
    position: fixed;
    top: 148px;
    left: 28px;
    right: 28px;
    bottom: 0;
    z-index: 1;
    &--left,
    &--right {
      position: absolute;
      top: 0;
      bottom: 0;
    }
    &--left {
      left: 0;
    }
    &--right {
      right: 0;
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
</style>
