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
 * @property `[records]`
 * @property `[total]`
 * @property `[size]`
 * @property `[current]`
 * @property `[orders]`
 * @property `[searchCount]`
 * @property `[pages]`
 */
export interface AlarmsBody {
  records?: Array<models.AlarmsBodyRecords>
  total?: number
  size?: number
  current?: number
  orders?: Array<string>
  searchCount?: boolean
  pages?: number
}