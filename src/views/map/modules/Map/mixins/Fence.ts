import { Component, Vue } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
@Component
export default class Table extends Vue {
  polygonEvent = {
    click: o => {
      // console.log(o)
    }
  }
  // 返回来的电子围栏的路径
  fencepath(item) {
    return item ? item.split(';').map(i => i.split(',')) : []
  }
}
