import Vue from 'vue'
declare module 'vue/types/vue' {
  interface Vue {
    $ajax: any
    $echarts: any
  }
}
// 声明全局的 window ，不然使用 window.XX 时会报错
declare var window: Window
declare var document: Document
declare module 'element-ui'
