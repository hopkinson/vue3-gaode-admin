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
 * @property `username` 账户
 * @property `password` 密码
 */
export interface LoginBody {
  /**
   * 账户
   */
  username: string
  /**
   * 密码
   */
  password: string
}
