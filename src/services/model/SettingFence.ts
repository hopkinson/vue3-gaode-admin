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
 * @property `[requestId]`
 * @property `[now]`
 * @property `[statusCode]`
 * @property `[body]` 电子围栏ID
 */
export interface SettingFence {
  requestId?: string
  now?: string
  statusCode?: number
  /**
   * 电子围栏ID
   */
  body?: string
}