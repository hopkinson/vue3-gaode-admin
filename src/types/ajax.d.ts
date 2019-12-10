export interface ExtraFetchParams {
  extra?: any
}

export interface WrappedFetchParams extends ExtraFetchParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD'
  url: string
  data?: any // post json
  query?: any
  header?: any
  path?: any
}

export declare class WrappedFetch {
  /**
   * @description ajax 方法
   */
  ajax(
    { method, url, data, query, header, extra }: WrappedFetchParams,
    path?: string,
    basePath?: string
  ): Promise<any>
  /**
   * @description 接口传参校验
   */
  check<V>(value: V, name: string): void
}
declare const _default: WrappedFetch
