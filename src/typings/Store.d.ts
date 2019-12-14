// Store仓库
import { Route } from 'vue-router'
export declare namespace Store {
  export interface Root {
    version: string
  }
  export interface User {
    userInfo: object | null
    token: string
    isSuperRole: boolean
  }
  export interface Permission {
    addRouters: Array<any>
    permissionList: object
  }
  export interface Dict {
    dict: Array<any>
  }
  export interface Path {
    saved_paths: Array<Route>
    active_path: string
    isCollapse: boolean
  }
}
