// 根据id来算总和
export function sumReduce<T>(array: Array<T>, key: string) {
  return array.reduce((total, current) => total + current[key], 0)
}
// 根据id对对象数组筛选

// 把两个对象数组通过相同的id合并到一起
export function mergeArr(target, output, targetKey, outputKey) {
  return target.map(item => ({
    ...item,
    ...output.find(subitem => subitem[outputKey] === item[targetKey])
  }))
}

// 数组对象根据ID找出相同属性的元素
export function filterArrayById<T, U>(
  target: Array<T>,
  origin: Array<U>,
  targetKey: string,
  orginKey: string
) {
  return target.filter(
    ele => origin.filter(x => x[orginKey] === ele[targetKey]).length > 0
  )
}
// 数组对象根据对象中指定的属性去重
export function uniqueByKey(arr, u_key) {
  let map = new Map()
  arr.forEach(item => {
    if (!map.has(item[u_key])) {
      map.set(item[u_key], item)
    }
  })
  return [...map.values()]
}

/**
 * js下载文件流
 */

export const downloadFile = (function() {
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.style.display = 'none'
  return function(data, name) {
    var blob = new Blob(data, { type: 'octet/stream' }),
      url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = name
    a.click()
    window.URL.revokeObjectURL(url)
  }
})()
