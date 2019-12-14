export const MAP = {
  key: 'd8629d0fd7aacdae4a39f068968b96c0', // 密钥
  zoom: 19, //初始化地图层级
  center: [113.453468, 23.154044], //初始化地图中心点
  zooms: [3, 22], // 缩放
  mapStyle: 'amap://styles/darkblue',
  tileUrl: 'http://zwcf5200.cn:10698/SubHD/tile/raster/[z]/[x]/[y].jpg' // 图层url
}

// 交通状态的图例
export const TRAFFIC_LEGEND = {
  1: {
    value: 'normal',
    label: '行驶',
    color: 'rgb(34, 168, 238)',
    gradientColor: [
      { offset: 0, color: 'rgb(8,177,255)' },
      { offset: 0.58, color: 'rgb(4,116,255)' },
      { offset: 1, color: 'rgb(0,54,255)' }
    ]
  },
  2: {
    value: 'stop',
    label: '停驶',
    color: 'rgb(179, 194, 237)',
    gradientColor: [
      { offset: 0, color: 'rgb(161,174,187)' },
      { offset: 0.58, color: 'rgb(135,148,177)' },
      { offset: 1, color: 'rgb(109,121,166)' }
    ]
  },
  3: {
    value: 'abnormal',
    label: '异常',
    color: 'rgb(255, 47, 45)',
    gradientColor: [
      { offset: 0, color: 'rgb(255,8,95)' },
      { offset: 0.58, color: 'rgb(255,4,48)' },
      { offset: 1, color: 'rgb(255,0,0)' }
    ]
  }
}
// 告警
export const WARNGING = {
  // 状态
  status: {
    1: {
      label: '违停',
      color: ' rgb(250, 82, 145)'
    },
    2: {
      label: '偏航',
      color: 'rgb(49, 217, 164)'
    },
    3: {
      label: '超速',
      color: 'rgb(143, 131, 255)'
    },
    4: {
      label: '逆行',
      color: 'rgb(252, 155, 3)'
    }
  }
}
