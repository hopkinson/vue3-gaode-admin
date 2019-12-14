// API 相关
export declare namespace Params {
  // 列表参数
  export interface Pagination {
    pageNum: number
    pageSize: number
  }
  // TOKEN
  export interface Token {
    token: string
    refreshToken: string
  }
  export interface Query {
    id: string
    name: string
  }
  export interface ListResult {
    records?: Array<any>
    total?: number
    size?: number
    current?: number
    searchCount?: boolean
    pages?: number
  }
}
