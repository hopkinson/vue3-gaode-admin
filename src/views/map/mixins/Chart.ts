import { Component, Vue } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
@Component
export default class Table extends Vue {
  // 列表 - 时速
  speed = []
  districts = []
  warning = []

  cars = {} // 车辆状态的信息
  async created() {
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
}
