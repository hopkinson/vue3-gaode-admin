import { Component, Vue, Prop, Ref } from 'vue-property-decorator'
import { CarLocationBody } from '@/services'
@Component
export default class Table extends Vue {
  @Ref('map') map: any
  // 围栏列表坐标
  @Prop({ type: Array, default: () => [] })
  public readonly fenceList!: Array<any>

  mouseTool: any = {} //注册全局绘制围栏插件实例
  fence: Array<Array<number>> = [] // 围栏坐标

  // 引入绘图插件  全局调用绘图插件
  initMouseTool() {
    this.mouseTool = new (AMap as any).MouseTool(this.map.$$getInstance())
    this.mouseTool.polygon({
      fillColor: 'rgb(55, 70, 95)',
      strokeColor: 'rgb(0, 140, 255)',
      strokeStyle: 'dashed',
      strokeWeight: 2,
      fillOpacity: 0.4
    })
    //监听draw事件可获取画好的覆盖物
    this.mouseTool.on('draw', e => {
      //每次只能传四个点，所以先清空
      this.fence = []
      let fenceArr: any = []
      //画出来的坐标放在存放在数组里面
      e.obj.getPath().forEach(path => {
        const { lng, lat } = path
        fenceArr.push([lng, lat])
      })
      this.$confirm('是否将绘制的范围添加到电子围栏里？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('add-fence', fenceArr)
        })
        .catch(() => {
          this.destroyMouseTool()
        })
    })
  }

  // 关闭绘图插件 清除你之前画的图像
  destroyMouseTool() {
    this.mouseTool.close(true)
    this.fence = []
  }
}
