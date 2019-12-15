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
 * @property `regionCode`
 * @property `name` 电子围栏名称
 * @property `type` 类型【0:禁入，1：可入】
 * @property `locations` 位置信息
 */
export interface SettingFenceIdBody {
  regionCode: string
  /**
   * 电子围栏名称
   */
  name: string
  /**
   * 类型【0:禁入，1：可入】
   */
  type: number
  /**
   * 位置信息
   */
  locations: Array<models.SettingfenceLocations>
}
