import SockJs from 'sockjs-client'
import Stomp from 'stompjs'
interface Socket {
  disconnect: Function
  subscribe: Function
  init: Function
  send: Function
  bConnected: boolean
  bFail: boolean
  $stompClient: any
  subscriberQueue: any
}
class WS implements Socket {
  bConnected = false
  bFail = false
  $stompClient: any = null
  subscriberQueue: any = []
  constructor(option: any) {
    this.$stompClient = null
    this.init(option)
  }

  subscribe(strTopic, oCallback) {
    if (this.bFail) {
      throw 'stomp connect to server failed'
    }
    if (this.bConnected) {
      this.$stompClient.subscribe(strTopic, oCallback)
    } else {
      this.subscriberQueue.push({
        topic: strTopic,
        callback: oCallback.bind(this)
      })
    }
  }
  send(...args) {
    if (this.$stompClient && this.bConnected) {
      if (args.length == 2) {
        this.$stompClient.send(args[0], {}, args[1])
      } else if (args.length == 3) {
        this.$stompClient.send(args[0], args[1], args[2])
      }
    }
  }

  init(options) {
    //init
    let m_Options = options || {}

    //初始化socket和stomp
    let socket = new SockJs(m_Options.endPoint)
    let stompClient = Stomp.over(socket)
    this.$stompClient = stompClient

    stompClient.connect(
      {},
      () => {
        this.bConnected = true
        console.log('success')
        if (this.subscriberQueue.length) {
          this.subscriberQueue.forEach(oSubscriber => {
            stompClient.subscribe(oSubscriber.topic, oSubscriber.callback)
          })
          this.subscriberQueue = []
        }
      },
      error => {
        this.bFail = true
        console.log('fail')
        console.error(error)
      }
    )
  }
  disconnect() {
    if (this.$stompClient && this.bConnected) {
      this.$stompClient.disconnect(() => {
        console.log('stomp disconnect from server')
      })
    }
  }
}
export default WS
