import axios, { AxiosError } from 'axios'
import { Notification } from 'element-ui'
import { ElNotificationOptions } from 'element-ui/types/notification'
import { WrappedFetchParams } from '@/types/ajax.d'
import uuid from '@/utils/uuid'
import router from '@/router'
import store from '@/store'
import Vue from 'vue'
import cookie from 'js-cookie'
import { TOKEN, REFRESH_TOKEN } from '@/config/constant'
import { baseRoute } from '../router/index'
const UUID = uuid()
const SUCCESS_CODE = 2000
const inst = axios.create({
  baseURL: `/api`,
  withCredentials: true,
  headers: {
    'X-Requested-Id': UUID
  }
})
const MSG = {
  500: '服务器开小差',
  502: '发布接口中...',
  404: '没找到资源',
  401: '登录信息过期，需重新登录',
  403: '没有权限'
}

const HTTP = {
  401: () => {
    store.commit('user/REMOVE_TOKEN')
    setTimeout(() => {
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }
      })
    }, 500)
  },
  406: async () => {
    const axios = new WrappedFetch()
    const token = await axios.ajax({
      method: 'POST',
      url: 'v1/refresh',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        refreshToken: cookie.get(REFRESH_TOKEN)
      }
    })
    store.commit('user/SET_TOKEN', token)
  }
}
// @cc: 检测 axios 响应状态
function onStatusError(error: AxiosError | Error) {
  const err =
    'response' in error && error.response
      ? {
          code: error.response.status,
          message: error.response.statusText
        }
      : { code: 10001, message: error.message || '接口问题～' }
  // 如果在401-500期间，则显示一个通知
  if (Object.keys(MSG).includes(err.code.toString())) {
    Notification({
      type: 'warning',
      title: '提示',
      message: MSG[err.code.toString()]
    } as ElNotificationOptions)
  }
  // 401,406 特别处理
  HTTP[err.code.toString()] && HTTP[err.code.toString()]()
  return Promise.reject(err.code)
}
export type AjaxPromise<R> = Promise<R>
export class WrappedFetch {
  /**
   * @description ajax 方法
   */
  public ajax(
    { method, url, data, query, header, extra }: WrappedFetchParams,
    path?: string,
    basePath?: string
  ) {
    let config = {
      ...extra,
      method: method.toLocaleLowerCase(),
      headers: { ...header, Authorization: cookie.get(TOKEN) || '' }
    }
    // json
    if (data) {
      config = {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        data
      }
    }
    return inst
      .request({ ...config, url, params: query })
      .then(res => {
        const { body, notification, statusCode } = res.data
        if (statusCode === 2000) {
          return Promise.resolve(body)
        } else {
          Notification({
            type: 'error',
            title: notification || '出错了，但是没有信息返回'
          } as ElNotificationOptions)
        }
      })
      .catch(onStatusError)
  }

  /**
   * @description 接口传参校验
   */
  public check<V>(value: V, name: string) {
    if (value === null || value === undefined) {
      const msg = `[ERROR PARAMS]: ${name} can't be null or undefined`
      // 非生产环境，直接抛出错误
      if (process.env.NODE_ENV === 'development') {
        throw Error(msg)
      }
    }
  }
}
// vue 注册实例
// 直接调用： this.$ajax.ajax
Vue.prototype.$ajax = new WrappedFetch()
export default new WrappedFetch()
