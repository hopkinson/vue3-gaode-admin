<template>
  <!--  车辆状态 -->
  <div class="chart">
    <div ref="chart" class="project__echarts"></div>
    <div class="chart__legend"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { TRAFFIC_LEGEND } from '@/config/dict'
import { filterDict } from '@/utils/filters'
@Component({
  name: 'ChartWarning'
})
export default class ChartWarning extends Vue {
  @Ref('chart') chart: any
  // 图表配置数据
  @Prop({ default: () => ({}), type: Object }) public readonly data!: any
  option: any = {
    // 圈内标题
    title: {
      text: 0,
      subtext: '总车辆数',
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 24,
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
          TRAFFIC_LEGEND[data.name.toString()].value
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
        radius: ['40%', '60%'],
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
  // get legend() {
  //   return
  // }
  //   初始化数据
  initData() {
    const { totalQuantity, statistics } = this.data
    const carsData = statistics.map(item => {
      return {
        value: item.quantity,
        name: item.runState,
        itemStyle: TRAFFIC_LEGEND[item.runState.toString()].color
      }
    })
    // 总数
    this.option.title.text = totalQuantity
    // 饼图数据
    this.option.series[0].data = carsData
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
<style lang="less" scoped>
.chart {
  &--inner {
    width: 380px;
    height: 175px;
  }
}
</style>
