export const MAP = {
  key: 'd8629d0fd7aacdae4a39f068968b96c0', // 密钥
  webapi: '0334a4c9f0ffc7e9bea11544898a56fb', //web-api
  zoom: 13, //初始化地图层级
  center: [113.469004, 23.103796], //初始化地图中心点
  zooms: [3, 20], // 缩放
  mapStyle: 'amap://styles/darkblue',
  tileUrl: 'http://183.62.55.237:7405/SubHD/tile/raster/[z]/[x]/[y].jpg' // 图层url
}

// 交通状态的图例
export const TRAFFIC_LEGEND = {
  1: {
    value: 'normal',
    label: '行驶',
    code: 1,
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
    code: 2,
    color: 'rgb(179, 194, 237)',
    gradientColor: [
      { offset: 0, color: 'rgb(161,174,187)' },
      { offset: 0.58, color: 'rgb(135,148,177)' },
      { offset: 1, color: 'rgb(109,121,166)' }
    ]
  },
  3: {
    value: 'abnormal',
    label: '警告',
    code: 3,
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
    0: {
      label: '无告警',
      value: 'normal',
      color: 'rgb(179, 194, 237)'
    },
    4: {
      label: '违停',
      value: 'weiting',
      color: ' rgb(250, 82, 145)'
    },
    3: {
      label: '偏航、逆行',
      value: 'pianni',
      color: ' rgb(250, 82, 145)'
    },
    1: {
      label: '偏航',
      value: 'pianhang',
      color: 'rgb(49, 217, 164)'
    },
    8: {
      label: '超速',
      value: 'chaosu',
      color: 'rgb(143, 131, 255)'
    },
    2: {
      value: 'nixing',
      label: '逆行',
      color: 'rgb(252, 155, 3)'
    }
  }
}
