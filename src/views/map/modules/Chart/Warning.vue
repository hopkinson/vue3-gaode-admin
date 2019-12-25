<template>
  <!-- 异常警告 -->
  <div ref="chart" class="project__echarts"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { WARNGING } from '@/config/dict'
import { sortOut } from '@/utils/index'
@Component({
  name: 'ChartWarning'
})
export default class ChartWarning extends Vue {
  @Ref('chart') chart: any
  // 图表配置数据
  @Prop({ default: () => [], type: Array }) public readonly data!: Array<any>
  option: any = {
    grid: {
      left: '6%',
      right: '5%',
      bottom: 0,
      top: '16%',
      containLabel: true
    },
    legend: {
      data: [],
      right: 30,
      top: '2%',
      textStyle: {
        color: '#fff'
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20
    },
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
    tooltip: {
      backgroundColor: 'transparent',
      formatter: function({ data }) {
        return Object.keys(data).length
          ? `
        <div class="project__echarts--tooltip-bar">
            <span class="project__echarts--tooltip-car-text">${data.name ||
              ''}：${data.value || ''}(${data.alarmTime})</span>
        </div>`
          : ''
      },
      position: 'top'
    },
    // x轴
    xAxis: [
      {
        type: 'category',
        data: [],
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#fff',
          show: true
        },
        axisTick: {
          show: false,
          alignWithLabel: true
        }
      },
      {
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    // 数据
    series: []
  }

  mounted() {
    this.$nextTick(() => {
      this.initData()
    })
  }

  //   初始化数据
  initData() {
    const data = this.data.filter(item => !!item.type)
    const sortedData = sortOut(data, 'type')
    const _quantity = this.data.map(item => Number(item.quantity)) // 告警数量
    const _alertTime = this.data.map(item => item.alarmTime) // 告警时间
    const _maxQuantity = Math.max.apply(null, _quantity)
    // 图表 - y轴
    const barData = Object.keys(sortedData).map((item, index) => {
      return {
        name: WARNGING.status[item.toString()].label,
        type: 'bar',
        barMaxWidth: 6,
        barGap: '50%',
        zlevel: 2,
        itemStyle: {
          normal: {
            color: WARNGING.status[item.toString()].color
          }
        },
        data: sortedData[item].map(v => {
          return {
            value: v.quantity,
            alarmTime: v.alarmTime,
            name: WARNGING.status[v.type.toString()].label
          }
        })
      }
    })
    const barBackgound = Object.keys(sortedData).map((item, index) => {
      return {
        type: 'bar',
        barGap: '50%',
        barWidth: 6,
        animation: false,
        xAxisIndex: 1,
        zlevel: 1,
        itemStyle: {
          color: '#071430'
        },
        data: Array([...new Set(_alertTime)].length).fill(_maxQuantity)
      }
    })
    this.option.xAxis[0].data = [...new Set(_alertTime)] // 图表 - x轴
    this.option.xAxis[1].data = [...new Set(_alertTime)] // 图表 - x轴
    this.option.series = [...barBackgound, ...barData] // 柱子的数据 和 背景
    this.option.legend.data = Object.values(WARNGING.status).map(
      item => item.label
    ) // 图例

    // 绘制图表
    const chart = this.$echarts.init(this.chart, { renderer: 'svg' })
    chart.setOption(this.option)
  }

  // 监听 - params
  @Watch('data', { deep: true })
  public watchData(val: any) {
    this.$nextTick(() => {
      this.initData()
    })
  }
}
</script>
<style lang="less" scoped>
.chart {
  width: 400px;
  height: 280px;
}
</style>
