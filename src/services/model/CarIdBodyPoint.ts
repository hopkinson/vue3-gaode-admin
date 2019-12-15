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
 * @description 当前位置
 * @property `longitude` 经度
 * @property `latitude` 纬度
 * @property `locateTime` 定位时间
 * @property `speed` 速度
 */
export interface CarIdBodyPoint {
  /**
   * 经度
   */
  longitude: number
  /**
   * 纬度
   */
  latitude: number
  /**
   * 定位时间
   */
  locateTime: string
  /**
   * 速度
   */
  speed: number
}
