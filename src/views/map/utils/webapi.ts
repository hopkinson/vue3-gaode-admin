import axios from 'axios'
import { MAP } from '@/config/dict'
import { Message } from 'element-ui'
const WEB_API = 'https://restapi.amap.com/v4/'

// 创建电子围栏
export const addFence = async points => {
  const {
    data: {
      data: { gid }
    }
  } = await axios.post(WEB_API + `geofence/meta?key=${MAP.webapi}`, {
    name: `hp围栏${Date.now()}`,
    points: points.join(';'),
    repeat: 'Mon,Tues,Wed,Thur,Fri,Sat,Sun'
  })
  if (gid) {
    Message({
      message: `成功创建围栏${gid}`,
      center: true
    })
  }
  return gid
}

// 获取电子围栏列表
export const getFenceList = async () => {
  const {
    data: {
      data: { rs_list }
    }
  } = await axios.get(WEB_API + 'geofence/meta', {
    params: {
      key: MAP.webapi
    }
  })
  return rs_list
}
