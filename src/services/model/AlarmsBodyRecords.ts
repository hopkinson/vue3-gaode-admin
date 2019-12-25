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
 * @property `id` 告警ID
 * @property `type` 告警类型 基础类型为【0:无告警, 1:偏航, 2逆行, 4:违停, 8:超速】 多种告警则数值累加，如3为偏航+逆行
 * @property `location` 火星坐标
 * @property `speed` 速度
 * @property `direction` 方向角
 * @property `alarmTime` 告警时间
 * @property `carId` 车辆ID
 * @property `carNo` 车牌号码
 * @property `readState` 是否已读
 */
export interface AlarmsBodyRecords {
  /**
   * 告警ID
   */
  id: string
  /**
   * 告警类型 基础类型为【0:无告警, 1:偏航, 2逆行, 4:违停, 8:超速】 多种告警则数值累加，如3为偏航+逆行
   */
  type: number
  /**
   * 火星坐标
   */
  location: string
  /**
   * 速度
   */
  speed: number
  /**
   * 方向角
   */
  direction: number
  /**
   * 告警时间
   */
  alarmTime: string
  /**
   * 车辆ID
   */
  carId: string
  /**
   * 车牌号码
   */
  carNo: string
  /**
   * 是否已读
   */
  readState: boolean
}
