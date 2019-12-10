import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 格式化时间
export const formatDay = (day, format = 'YYYY-MMMM') => {
  if (!day) {
    return ''
  }
  return dayjs(day)
    .locale('zh-cn')
    .format(format)
}

export const formatMoney = (num, sign = '￥') => {
  if (!num) {
    return 0
  }
  if (typeof num === 'string') {
    num = num
      .slice(1)
      .split(',')
      .join('')
  }
  num = num.toFixed(2)
  num = parseFloat(num)
  num = num.toLocaleString()
  return sign + num
}

/* 针对字典的过滤
规定字典格式：
  是否有库存
  isStock: [
    {
      label: '需要开机',
      value: '0'
    }, {
      label: '有库存',
      value: '1'
    }
  ], */
interface dict {
  label: string
  value: string | number
}
export const filterDict = (
  val: any,
  $arr: Array<dict>,
  value = 'label',
  key = 'value'
) => {
  try {
    let result = $arr.find(item => item[key] === val)
    if (result) {
      return result[value]
    }
  } catch (e) {
    return ''
  }
}
