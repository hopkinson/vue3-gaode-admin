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
 * @property `[alarmType]` 告警类型
 * @property `location` 坐标(格式: 113.339, 23.1874)
 * @property `marsLocation` 火星坐标(格式: 113.339, 23.1874)
 * @property `speed` 速度
 * @property `direction` 方位角
 * @property `locateTime` 定位时间
 * @property `runState` 车辆状态[1:行驶, 2:停驶, 3:异常]
 */
export interface CarLocationLocation {
  /**
   * 告警类型
   */
  alarmType?: number
  /**
   * 坐标(格式: 113.339, 23.1874)
   */
  location: string
  /**
   * 火星坐标(格式: 113.339, 23.1874)
   */
  marsLocation: number
  /**
   * 速度
   */
  speed: number
  /**
   * 方位角
   */
  direction: number
  /**
   * 定位时间
   */
  locateTime: string
  /**
   * 车辆状态[1:行驶, 2:停驶, 3:异常]
   */
  runState: number
}