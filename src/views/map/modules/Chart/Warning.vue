<template>
  <!-- 异常警告 -->
  <div ref="chart" class="chart"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
const colorList = [
  '#8d7fec',
  '#5085f2',
  '#e75fc3',
  '#f87be2',
  '#f2719a',
  '#fca4bb',
  '#f59a8f',
  '#fdb301',
  '#57e7ec',
  '#cf9ef1'
]
@Component({
  name: 'ChartWarning'
})
export default class ChartWarning extends Vue {
  @Ref('chart') chart: any
  // 图表配置数据
  @Prop({ default: () => [], type: Array }) public readonly data!: Array<any>
  option: any = {
    // y轴
    yAxis: [
      {
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#fff'
        },
        type: 'value'
      }
    ],
    // x轴
    xAxis: [
      {
        type: 'category',
        data: [],
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#fff'
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        }
      }
    ],
    // 数据
    series: [{}]
  }

  mounted() {
    this.initData()
  }

  //   初始化数据
  initData() {
    const alertTypeId = [...new Set(this.data.map(item => item.alertTypeId))] // 告警类型ID
    const _quantity = this.data.map(item => Number(item.quantity)) // 告警数量
    const _alertTime = this.data.map(item => item.alertTime) // 告警时间
    const _maxQuantity = Math.max.apply(null, _quantity)
    // 图表 - y轴
    const barData = alertTypeId.map((item, index) => {
      return {
        name: item,
        type: 'bar',
        barMaxWidth: 6,
        barGap: 1,
        itemStyle: {
          normal: {
            color: function(params) {
              var num = colorList.length
              return colorList[params.dataIndex % num]
            },
            barBorderRadius: 5
          }
        },
        data: this.data
          .filter(sub => sub.alertTypeId === item)
          .map(v => v.alertTypeId === item)
      }
    })
    const barBackgound = alertTypeId.map((item, index) => {
      return {
        name: item,
        type: 'bar',
        barGap: '-100%',
        barWidth: 6,
        animation: false,
        z: -1,
        itemStyle: {
          color: '#071430',
          barBorderRadius: 15
        },
        data: _maxQuantity
      }
    })
    this.option.xAxis.data = _alertTime // 图表 - x轴
    this.option.series.push(barData) // 柱子的数据
    this.option.series.push(barBackgound) // 柱子的背景
    // 绘制图表
    const chart = this.$echarts.init(this.chart)
    chart.setOption(this.option)
  }

  // 监听 - params
  @Watch('data', { deep: true, immediate: true })
  public watchData(val: any) {
    this.initData()
  }
}
</script>
<style lang="less" scoped>
.chart {
  width: 400px;
  height: 280px;
}
</style>
