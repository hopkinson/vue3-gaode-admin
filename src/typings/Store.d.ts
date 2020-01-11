// Store仓库
import { Route } from 'vue-router'
import { CarLocationBody } from '@/services'

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
  export interface App {
    isFullScreen: boolean
  }

  export interface Map {
    isDragging: boolean
    isEnd: boolean
    isPlaying: boolean
    speed: number
    showDrawer: boolean
    passedLength: number
    trackMarkers: Array<CarLocationBody>
  }
}
