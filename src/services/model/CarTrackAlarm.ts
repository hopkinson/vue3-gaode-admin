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
 * @property `[now]`
 * @property `[statusCode]`
 * @property `[body]` 坐标(格式：\"[       [         113.46596446617738,         23.109347443139264       ],       [         113.46595685895166,         23.109360818329613       ]     ]\")
 */
export interface CarTrackAlarm {
  now?: string
  statusCode?: number
  /**
   * 坐标(格式：\"[       [         113.46596446617738,         23.109347443139264       ],       [         113.46595685895166,         23.109360818329613       ]     ]\")
   */
  body?: Array<Array<number>>
}