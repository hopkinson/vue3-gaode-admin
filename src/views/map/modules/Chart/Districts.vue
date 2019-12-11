<template>
  <!-- 当天最高时速 -->
  <div ref="chart" class="project__echarts"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
@Component({
  name: 'ChartWarning'
})
export default class ChartWarning extends Vue {
  @Ref('chart') chart: any
  // 图表配置数据
  @Prop({ default: () => [], type: Array }) public readonly data!: Array<any>
  option: any = {
    // y轴
    yAxis: {
      data: [],
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        color: '#fff'
      }
    },
    // x轴
    xAxis: [
      {
        type: 'value',
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
    ],
    // 数据
    series: [
      {
        type: 'bar',
        barMaxWidth: 6,
        itemStyle: {
          normal: {
            barBorderRadius: 15,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgb(138,0,255)' },
              { offset: 1, color: 'rgb(0,246,255)' }
            ])
          }
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#ffffff',
              fontSize: '16'
            }
          }
        },
        data: []
      }
    ]
  }
  mounted() {
    this.initData()
  }

  //   初始化数据
  initData() {
    const _regionName = this.data.map(item => item.regionName)
    const _quantity = this.data.map(item => Number(item.quantity))
    // 图表 - y轴
    this.option.yAxis.data = _regionName
    // 图表 - x轴
    this.option.series[0].data = _quantity
    // 绘制图表
    const chart = this.$echarts.init(this.chart)
    chart.setOption(this.option)
  }

  // 监听 - params
  @Watch('data', { deep: true })
  public watchData(val: any) {
    this.initData()
  }
}
</script>
<style lang="less" scoped></style>
