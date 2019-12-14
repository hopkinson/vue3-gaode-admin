interface Socket {
  url: string
  intervalId: null | number
  onerror: Function
  onopen: Function
  onmessage: Function
  success: Function
  send: Function
}
class WS implements Socket {
  intervalId: number | null
  url: string
  success: Function
  webSocket: any
  constructor(url: string, success: Function) {
    this.intervalId = null
    this.url = url
    this.main()
    this.success = success
  }

  // 服务器已连接
  onopen() {
    this.webSocket.onopen = () => {
      if (this.intervalId) {
        window.clearInterval(this.intervalId)
        this.intervalId = null
      }
      this.success(this)
    }
  }
  // 网络连接已断开
  onclose() {
    this.webSocket.onclose = () => {
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          // console.log('=============正在尝试重新连接=============')
          this.main()
        }, 2000)
      }
    }
  }
  // 连接异常
  onerror() {
    this.webSocket.onerror = () => {
      // console.log('=============连接异常=============')
    }
  }
  // 接收
  onmessage(callback: Function) {
    this.webSocket.onmessage = (evt: any) => {
      callback(evt.data)
    }
  }
  //  发送
  send(info: any) {
    this.webSocket.send(info)
  }

  main() {
    this.webSocket = new WebSocket(`ws://${this.url}`)
    this.onopen()
    this.onclose()
    this.onerror()
  }
}
export default WS
