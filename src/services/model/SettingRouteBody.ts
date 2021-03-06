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
 * @property `name` 行驶路线名称
 * @property `locations` 位置信息
 */
export interface SettingRouteBody {
  /**
   * 行驶路线名称
   */
  name: string
  /**
   * 位置信息
   */
  locations: Array<Array<number>>
}
