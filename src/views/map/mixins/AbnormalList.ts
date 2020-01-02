// 异常列表
import { Component, Vue, Watch } from 'vue-property-decorator'
// import { AlarmsPageBodyRecords } from '@/services'
import Websocket from '@/plugins/websocket'
@Component
export default class Table extends Vue {
  showAbnormalDrawer: boolean = false // 是否显示右侧抽屉（异常）
  abnormalBody = {} // 异常列表
  carDetail = {}
  //   参数
  abnormalParams = {
    pageNum: '',
    pageSize: 10
  }
  abnormalNum = 2 // 警告信息数量
  websocket: any = null // websocket连接

  created() {
    //订阅websocket消息
    this.websocket = new Websocket({
      endPoint: process.env.VUE_APP_WS_API
    })
    this.websocket.subscribes('/socket/topic/alarms', ({ body }) => {
      // const result = JSON.parse(body)
      // this.abnormalNum = result
    })
  }

  beforeDestroy() {
    this.websocket.disconnect()
  }

  // 点击 异常按钮 - 显示列表内容
  async showAbnormalList() {
    this.showAbnormalDrawer = true
    this.abnormalParams = Object.assign({}, this.abnormalParams, {
      pageNum: 0
    })
  }

  // 跳转告警统计列表
  goToQuery() {
    this.$router.push({
      path: '/query'
    })
  }
  // 显示告警详情
  async showAbnormalDetail(detail) {
    if (!detail.readState) {
      await this.$ajax.ajax({
        method: 'PUT',
        url: `v1/alarm/read/${detail.id}`
      })
    }
    this.carDetail = detail
  }

  // 改变当前页
  abnormalCurrentChange(pageNum) {
    this.abnormalParams = Object.assign({}, this.abnormalParams, {
      pageNum
    })
  }

  @Watch('abnormalParams', { deep: true })
  public async watchAbnormalParams(val) {
    // 异常列表
    this.abnormalBody = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/alarms/page',
      data: val
    })
  }
}
