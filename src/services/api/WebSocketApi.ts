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

import ajax, { AjaxPromise } from '@ajax'
import * as models from '../model/models'

/* tslint:disable:no-unused-variable member-ordering object-literal-shorthand */

/**
 * @description wsAlertClientIdIdGet参数
 * @property `clientId`
 * @property `id`
 */
export interface ParamswsAlertClientIdIdGet {
  // pathParams
  /**
   *
   */
  clientId: string
  /**
   *
   */
  id: string
}
/**
 * @description wsCarsCliendIdGet参数
 * @property `cliendId`
 */
export interface ParamswsCarsCliendIdGet {
  // pathParams
  /**
   *
   */
  cliendId: string
}
export class WebSocketApi {
  protected $basePath = '/api/v1'.replace(/\/$/, '')

  public constructor(basePath?: string) {
    if (basePath !== undefined) {
      this.$basePath = basePath.replace(/\/$/, '')
    }
  }

  /**
   * 
   * @summary 告警信息
   * @param params ParamswsAlertClientIdIdGet
   
   * @returns models.ERRORUNKNOWN
   */
  public wsAlertClientIdIdGet = (
    params: ParamswsAlertClientIdIdGet
  ): AjaxPromise<models.ERRORUNKNOWN> => {
    const path = '/ws/alert/{clientId}/{id}'
    const url =
      this.$basePath +
      path.replace(/\{([^}]+)\}/g, (all, param) =>
        param in params ? params[param] : param
      )
    const p: any = {}
    ajax.check(params.clientId, 'clientId')
    ajax.check(params.id, 'id')
    return ajax.ajax(
      {
        method: 'GET',
        url,
        ...p
      },
      path,
      this.$basePath
    )
  }
  /**
   * 
   * @summary 车辆当前位置信息列表
   * @param params ParamswsCarsCliendIdGet
   
   * @returns models.ERRORUNKNOWN
   */
  public wsCarsCliendIdGet = (
    params: ParamswsCarsCliendIdGet
  ): AjaxPromise<models.ERRORUNKNOWN> => {
    const path = '/ws/cars/{cliendId}'
    const url =
      this.$basePath +
      path.replace(/\{([^}]+)\}/g, (all, param) =>
        param in params ? params[param] : param
      )
    const p: any = {}
    ajax.check(params.cliendId, 'cliendId')
    return ajax.ajax(
      {
        method: 'GET',
        url,
        ...p
      },
      path,
      this.$basePath
    )
  }
}

export default new WebSocketApi()
