<template>
  <div id="map-container" class="map_box"></div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { MAP } from '@/config/dict'
const AMap = require('AMap')
// const AMapUI = require('AMapUI')
@Component({
  name: 'MapHomeComponent'
})
export default class MapHomeComponent extends Vue {
  mounted() {
    var map = new AMap.Map('map-container', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 19, //初始化地图层级
      center: [113.453468, 23.154044], //初始化地图中心点
      zooms: [3, 22],
      expandZoomRange: true
    })
    map.setMapStyle('amap://styles/darkblue')
    //创建自定义切片图层，指定 getTileUrl 属性
    var googleLayer = new AMap.TileLayer({
      getTileUrl: 'http://zwcf5200.cn:10698/SubHD/tile/raster/[z]/[x]/[y].jpg',
      zIndex: 2
    })
    googleLayer.setMap(map)
  }
}
</script>

<style lang="less" scoped>
.map_box {
  width: 100%;
  height: 100%;
}
</style>
