import { Component, Vue, Ref } from 'vue-property-decorator'
import { addFence, getFenceList } from '../utils/webapi'
@Component
export default class Table extends Vue {
  @Ref('map') map: any
  fenceList: Array<any> = [] //围栏列表
  // 新增电子围栏
  addFence() {
    this.map.initMouseTool()
  }
  // 关闭编辑电子围栏
  closeFence() {
    this.map.destroyMouseTool()
  }

  // 新建电子围栏
  async createFence(points) {
    const gid = await addFence(points)
    if (gid) {
      this.fenceList = await getFenceList()
      this.map.destroyMouseTool()
    }
  }
}
