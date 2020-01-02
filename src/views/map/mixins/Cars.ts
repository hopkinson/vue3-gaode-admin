import { Component, Vue } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
@Component
export default class Table extends Vue {
  carList: Array<CarLocationBody> = [] // 所有车辆的列表
  created() {
    this.pollingLocation()
    setInterval(() => {
      this.pollingLocation()
    }, 30000)
  }
  interval: number = 0 // 计时器
  // 新增电子围栏
  beforeDestroy() {
    clearInterval(this.interval)
    this.interval = 0
  }

  // 长轮询 - 返回车辆实时位置信息
  async pollingLocation() {
    this.carList = await this.$ajax.ajax({
      method: 'POST',
      url: `v1/car/location`
    })
  }
}
