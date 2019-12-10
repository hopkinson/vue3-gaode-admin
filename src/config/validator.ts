// 电话号码
export const mobile = /^1[34578]\d{9}$/
// 中文，大写，小写，数字
export const invalidSymbol = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
// 由数字、26个英文字母或者下划线组成的字符串
export const noChineseSymbol = /^\w+$/
// 电子邮件
export const email = /(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/
// 有1~3位小数的正实数
export const float3pot = /^[0-9]+(.[0-9]{1,3})?$/
// 身份证
export const IDcard = /^\d{15}|\d{18}$/
// 非0的正整数
export const posiIntegers = /^[1-9]\d$/
