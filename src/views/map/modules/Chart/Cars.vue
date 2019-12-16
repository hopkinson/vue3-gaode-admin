<template>
  <!--  车辆状态 -->
  <div ref="chart" class="project__echarts"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { TRAFFIC_LEGEND } from '@/config/dict'
@Component({
  name: 'ChartWarning'
})
export default class ChartWarning extends Vue {
  @Ref('chart') chart: any
  // 图表配置数据
  @Prop({ default: () => ({}), type: Object }) public readonly data!: any
  option: any = {
    grid: {
      top: '17%',
      bottom: '48%',
      left: '10%',
      containLabel: false
    },
    legend: {
      data: [],
      orient: 'vartical',
      top: 'center',
      right: 38,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      formatter: name => {
        let oa = this.option.series[0].data
        const percent = (
          (oa.find(i => i.name === name).value / this.data.totalQuantity) *
          100
        ).toFixed(2)
        return '{a|' + name + '}' + '{b|' + percent + '}%'
      },
      textStyle: {
        color: '#fff',
        fontSize: 12,
        rich: {
          a: { padding: [0, 0, 0, 5] },
          b: {
            padding: [0, 0, 0, 45]
          }
        }
      }
    },
    // 圈内标题
    title: {
      text: 0,
      subtext: '总车辆数',
      left: '23%',
      y: 'center',
      textStyle: {
        fontSize: 24,
        lineHeight: 15,
        fontWeight: 'bold',
        color: ['#fff']
      },
      subtextStyle: {
        color: 'rgba(255, 255, 255, 0.702)',
        fontSize: 12
      }
    },
    tooltip: {
      backgroundColor: 'transparent',
      formatter: function({ data }) {
        return `
        <div class="project__echarts--tooltip-pie">
        <i class="project__car-status is-${
          TRAFFIC_LEGEND[data.runState.toString()].value
        }"></i> 
            <span class="project__echarts--tooltip-car-text">${
              data.value
            }辆</span>
        </div>`
      }
    },
    // 数据
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['30%', '55%'],
        clockwise: false, //饼图的扇区是否是顺时针排布
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
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
    const {
      totalQuantity,
      abnormalQuantity,
      runningQuantity,
      stopQuantity
    } = this.data
    const chartData = [
      {
        quantity: abnormalQuantity,
        runState: 3
      },
      {
        quantity: runningQuantity,
        runState: 1
      },
      {
        quantity: stopQuantity,
        runState: 2
      }
    ]
    const carsData = chartData.map(item => {
      return {
        value: item.quantity,
        name: TRAFFIC_LEGEND[item.runState.toString()].label,
        runState: item.runState,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: TRAFFIC_LEGEND[item.runState.toString()].gradientColor,
            global: false // 缺省为 false
          }
        }
      }
    })
    // 总数
    this.option.title.text = totalQuantity
    // 饼图数据
    this.option.series[0].data = carsData
    this.option.legend.data = Object.values(TRAFFIC_LEGEND).map(
      item => item.label
    )
    // 绘制图表
    const chart = this.$echarts.init(this.chart, { renderer: 'svg' })
    chart.setOption(this.option)
  }

  // 监听 - params
  @Watch('data', { deep: true })
  public watchData(val: any) {
    this.initData()
  }
}
</script>
<style lang="less" scoped>
.chart {
  &--inner {
    width: 380px;
    height: 175px;
  }
}
</style>
