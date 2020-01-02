import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Table extends Vue {
  // 加载预设
  async loadPreMarkers(val) {
    return await this.$ajax.ajax({
      method: 'GET',
      url: `v1/route/car/${val.id}`
    })
  }
}
