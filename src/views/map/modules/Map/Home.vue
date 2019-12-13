<template>
  <el-amap
    class="map"
    vid="amap-vue"
    :zoom="zoom"
    :zooms="zooms"
    :events="events"
    :center="center"
    :amapManager="amapManager"
  >
    <!-- 多边形 -->
    <el-amap-polygon
      v-for="(polygon, index) in polygons"
      :key="index"
      :vid="index"
      :ref="`polygon_${index}`"
      :path="polygon.path"
      :events="polygon.events"
    ></el-amap-polygon>
    <!-- 信息窗体 -->
    <el-amap-info-window :position="position" v-if="showInfo">
      <panel-car-detail v-bind="$attrs" v-on="$listeners"></panel-car-detail>
    </el-amap-info-window>
    <!-- 点聚合 -->
    <el-amap-marker
      v-for="(marker, index) in markers"
      :key="`market${index}`"
      :position="marker.position"
      :content="marker.content"
      :events="marker.events"
    ></el-amap-marker>
  </el-amap>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MAP } from '@/config/dict'
import { AMapManager } from 'vue-amap'
import PanelCarDetail from '../Panel/CarDetail.vue'
let amapManager = new AMapManager()
@Component({
  name: 'MapHome',
  components: {
    PanelCarDetail
  }
})
export default class MapHome extends Vue {
  amapManager = amapManager
  showInfo = false
  zoom: number = MAP.zoom
  zooms: Array<number> = MAP.zooms
  center: Array<number> = MAP.center
  position: Array<number> = MAP.center
  markers: any = []
  markerRefs: any = []
  plugin: Array<string> = ['PolyEditor', 'MarkerClusterer']
  polygons: any = [
    {
      strokeColor: 'red',
      strokeStyle: 'dashed',
      strokeOpacity: 0,
      path: [
        [113.453468, 23.154044],
        [113.453489, 23.154054],
        [113.453439, 23.154154],
        [113.453458, 23.154034]
      ],
      events: {
        click: () => {
          alert('click polygon')
        }
      }
    }
  ]
  events: any = {
    init: o => {
      const self: any = this
      o.setMapStyle(MAP.mapStyle)
      new AMap.TileLayer({
        getTileUrl: MAP.tileUrl,
        zIndex: 2
      })
      // setTimeout(() => {
      //   let cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
      //     gridSize: 80,
      //     renderCluserMarker: self._renderCluserMarker
      //   })
      //   console.log(cluster)
      // }, 1000)
    },
    moveend: () => {},
    click: e => {
      alert('map clicked')
    }
  }
  created() {
    let markers: any = []
    let index = 0
    const self = this
    let basePosition = MAP.center

    // while (++index <= 30) {
    //   markers.push({
    //     position: [basePosition[0] + 0.01 * index, basePosition[1]],
    //     content:
    //       '<div style="text-align:center; background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
    //     events: {
    //       init(o) {
    //         self.markerRefs.push(o)
    //       }
    //     }
    //   })
    // }

    this.markers = markers
  }
  _renderCluserMarker(context) {
    const count = this.markers.length

    let factor = Math.pow(context.count / count, 1 / 18)
    let div = document.createElement('div')
    let Hue = 180 - factor * 180
    let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
    let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
    let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
    let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
    div.style.backgroundColor = bgColor
    let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
    div.style.width = div.style.height = size + 'px'
    div.style.border = 'solid 1px ' + borderColor
    div.style.borderRadius = size / 2 + 'px'
    div.style.boxShadow = '0 0 1px ' + shadowColor
    div.innerHTML = context.count
    div.style.lineHeight = size + 'px'
    div.style.color = fontColor
    div.style.fontSize = '14px'
    div.style.textAlign = 'center'
    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
    context.marker.setContent(div)
  }
}
</script>
<style lang="less" scoped>
.map {
}
</style>
