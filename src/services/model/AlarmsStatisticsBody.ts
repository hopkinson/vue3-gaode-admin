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
 * @property `companyName` 单位名称
 * @property `carNo` 车牌号码
 * @property `beginDate` 起始统计日期(yyyy-MM-dd)
 * @property `endDate` 结束统计日期(yyyy-MM-dd)
 * @property `alarmQuantities` 告警数量
 */
export interface AlarmsStatisticsBody {
  /**
   * 单位名称
   */
  companyName: string
  /**
   * 车牌号码
   */
  carNo: string
  /**
   * 起始统计日期(yyyy-MM-dd)
   */
  beginDate: string
  /**
   * 结束统计日期(yyyy-MM-dd)
   */
  endDate: string
  /**
   * 告警数量
   */
  alarmQuantities: Array<models.AlarmsStatisticsAlarmQuantities>
}
