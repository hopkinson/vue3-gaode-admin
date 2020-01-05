import { Component, Vue, Prop } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
@Component
export default class Table extends Vue {
  markerRefs: any = [] // 点聚合
  markerCluster: any = {}
  // 折线&点 - 坐标（用于轨迹回放）
  @Prop({ type: Array, default: () => [] })
  public readonly markers!: Array<any>

  initMarkerCluster(map) {
    const self = this
    setTimeout(() => {
      self.markerCluster = new (AMap as any).MarkerClusterer(
        map,
        self.markerRefs,
        {
          gridSize: 20,
          maxZoom: 16,
          averageCenter: true,
          renderCluserMarker: this.renderCluserMarker
        }
      )
    }, 1000)
  }
  // 聚合坐标
  renderCluserMarker(context) {
    const count = this.markers.length
    let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
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
}
