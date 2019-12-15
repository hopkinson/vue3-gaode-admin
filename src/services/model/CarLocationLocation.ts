/**
 * 便民车监管平台
 * unknown
 *
 * OpenAPI spec version: last
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models'

/**
 * @description 位置信息
 * @property `[longitude]` 经度
 * @property `[latitude]` 纬度
 * @property `[marsLongitude]` 火星坐标经度
 * @property `[marsLatitude]` 火星坐标纬度
 * @property `[speed]` 速度
 * @property `[direction]` 方位角
 * @property `[locateTime]` 定位时间
 * @property `runState` 车辆状态【RUNNING: 行驶, STOP: 停驶, ABNORMAL:异常】
 */
export interface CarLocationLocation {
  /**
   * 经度
   */
  longitude?: number
  /**
   * 纬度
   */
  latitude?: number
  /**
   * 火星坐标经度
   */
  marsLongitude?: number
  /**
   * 火星坐标纬度
   */
  marsLatitude?: number
  /**
   * 速度
   */
  speed?: number
  /**
   * 方位角
   */
  direction?: number
  /**
   * 定位时间
   */
  locateTime?: string
  /**
   * 车辆状态【RUNNING: 行驶, STOP: 停驶, ABNORMAL:异常】
   */
  runState: number
}
