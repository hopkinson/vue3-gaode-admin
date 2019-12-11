export const MAP = {
  key: 'd8629d0fd7aacdae4a39f068968b96c0', // 密钥
  zoom: 19, //初始化地图层级
  center: [113.453468, 23.154044], //初始化地图中心点
  zooms: [3, 22], // 缩放
  mapStyle: 'amap://styles/darkblue',
  tileUrl: 'http://zwcf5200.cn:10698/SubHD/tile/raster/[z]/[x]/[y].jpg' // 图层url
}

// 交通状态的图例
export const TRAFFIC_LEGEND = [
  {
    code: 1,
    value: 'normal',
    label: '行驶',
    color: 'rgb(34, 168, 238)'
  },
  {
    code: 2,
    value: 'stop',
    label: '停驶',
    color: 'rgb(179, 194, 237)'
  },
  {
    code: 3,
    value: 'abnormal',
    label: '异常',
    color: 'rgb(255, 47, 45)'
  }
]

export const WARNGING = {
  status: [
    { label: '违停', color: '' },
    { label: '占道' },
    { label: '偏航' },
    { label: '超速' },
    { label: '逆行' }
  ]
}
