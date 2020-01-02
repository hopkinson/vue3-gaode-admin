import { Component, Vue, Prop } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
@Component
export default class Table extends Vue {
  preMarkers: Array<Array<number>> = [] // 预设轨迹
  //  请求预设轨迹的接口
  @Prop({ type: Function, default: () => {} })
  public readonly loadPreTrack!: Function

  async initPreTrack(val) {
    this.preMarkers = await this.loadPreTrack(val) // 加载预设轨迹
  }
}
