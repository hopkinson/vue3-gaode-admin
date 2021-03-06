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
 * @property `id` 用户ID
 * @property `username` 账户
 * @property `password` 密码
 * @property `name` 名称
 * @property `mobile` 手机号码
 */
export interface UserBody {
  /**
   * 用户ID
   */
  id: number
  /**
   * 账户
   */
  username: string
  /**
   * 密码
   */
  password: string
  /**
   * 名称
   */
  name: string
  /**
   * 手机号码
   */
  mobile: string
}
