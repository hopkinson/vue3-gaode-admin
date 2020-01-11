// 异常列表
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { CarLocationBody } from '@/services'

import Websocket from '@/plugins/websocket'
@Component
export default class Table extends Vue {
  @Getter('map/showDrawer') showTrackDrawer!: boolean // 是否显示底部抽屉（轨迹）
  @Getter('map/trackMarkers') trackMarkers!: Array<CarLocationBody> // 坐标数组

  @Mutation('map/IS_SHOW_DRAWER') isShowDrawer // 方法 - 显示抽屉的状态
  @Mutation('map/SET_TRACK_MARKERS') setTrackMarkers // 方法 - 设置轨迹

  showAbnormalDrawer: boolean = false // 是否显示右侧抽屉（异常）
  abnormalBody = {} // 异常列表
  carDetail = {}
  //   参数
  abnormalParams = {
    pageNum: '',
    pageSize: 10
  }
  // 轨迹表单
  trackForm = {
    carId: '',
    beginTime: '',
    endTime: ''
  }
  abnormalNum = 0 // 警告信息数量
  websocket: any = null // websocket连接
  async created() {
    //订阅websocket消息
    this.websocket = new Websocket({
      endPoint: process.env.VUE_APP_WS_API
    })
    this.websocket.subscribes('/socket/topic/alarms/quantity', ({ body }) => {
      const result = Number(body)
      this.abnormalNum = result
    })
    const _alarmId = sessionStorage.getItem('ALARMID')
    if (_alarmId) {
      const detail = await this.$ajax.ajax({
        method: 'GET',
        url: `v1/alarms/${_alarmId}`
      })
      this.showAbnormalDetail(detail)
      sessionStorage.removeItem('ALARMID')
    }
    this.abnormalNum = await this.$ajax.ajax({
      method: 'GET',
      url: `v1/alarms/unread`
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
    // 1. 将未读设为已读
    if (!detail.readState) {
      await this.$ajax.ajax({
        method: 'PUT',
        url: `v1/alarm/read`,
        data: {
          carId: detail.carId,
          alarmNumber: detail.alarmNumber
        }
      })
      detail.readState = true
      // 返回未读数量
      this.abnormalNum = await this.$ajax.ajax({
        method: 'GET',
        url: `v1/alarms/unread`
      })
    }
    // 2. 设置汽车详情
    this.carDetail = {
      ...detail,
      alarmType: detail.type,
      runState: 3,
      id: detail.carId
    }
    // 3. 显示抽屉
    this.isShowDrawer(true)
    // 4. 设置抽屉时间
    this.trackForm = {
      carId: detail.carId,
      beginTime: detail.alarmTime,
      endTime: detail.closeTime
    }
    this.handleSearchTrack(this.trackForm)
  }

  // 改变当前页
  abnormalCurrentChange(pageNum) {
    this.abnormalParams = Object.assign({}, this.abnormalParams, {
      pageNum
    })
  }

  // 返回实际轨迹
  async handleSearchTrack(data) {
    const tracks = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/car/track',
      data: data
    })
    this.setTrackMarkers(tracks)
    if (!this.trackMarkers.length) {
      this.$message({
        message: '没有任何轨迹',
        type: 'error'
      })
    }
  }

  @Watch('abnormalParams', { deep: true })
  public async watchAbnormalParams(val) {
    // 异常列表
    this.abnormalBody = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/alarms/page-today',
      query: val,
      data: val
    })
  }
}
