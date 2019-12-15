// 配合table-curd使用
import { Component, Vue, PropSync, Prop, Ref } from 'vue-property-decorator'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
@Component
export default class Table extends Vue {
  stompClient: any = ''
  timer: any = null
  initWebSocket() {
    this.connection()
    // 断开重连机制,尝试发送消息,捕获异常发生时重连
    this.timer = setInterval(() => {
      try {
        this.stompClient.send('test')
      } catch (err) {
        this.connection()
      }
    }, 5000)
  }
  connection() {
    // 建立连接对象
    let socket = new SockJS(process.env.VUE_APP_WS_API)
    // 获取STOMP子协议的客户端对象
    this.stompClient = Stomp.over(socket)
    // 定义客户端的认证信息,按需求配置
    let headers = {
      Authorization: ''
    }
    // 向服务器发起websocket连接
    this.stompClient.connect(
      headers,
      () => {
        this.stompClient.subscribe(
          '/socket/topic/alarms',
          msg => {
            // 订阅服务端提供的某个topic
            console.log('广播成功')
            console.log(msg) // msg.body存放的是服务端发送给我们的信息
          },
          headers
        )
        // this.stompClient.send(
        //   '/app/chat.addUser',
        //   headers,
        //   JSON.stringify({ sender: '', chatType: 'JOIN' })
        // ) //用户加入接口
      },
      err => {
        this.$message({
          message: '连接websocket失败'
        })
      }
    )
  }
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
  }
  mounted() {
    this.initWebSocket()
  }
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    this.disconnect()
    clearInterval(this.timer)
  }
}
