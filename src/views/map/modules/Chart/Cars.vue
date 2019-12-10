<template>
  <!--  车辆状态 -->
  <div ref="chart" class="chart"></div>
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
  @Prop({ default: () => [], type: Array }) public readonly data!: Array<any>
  option: any = {
    // 圈内标题
    title: {
      text: '201',
      subtext: '总车辆数',
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: ['#fff']
      },
      subtextStyle: {
        color: 'rgba(255, 255, 255, 0.702);',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'item'
      // formatter: function(parms) {
      //   var str =
      //     parms.seriesName +
      //     '</br>' +
      //     parms.marker +
      //     '' +
      //     parms.data.legendname +
      //     '</br>' +
      //     '数量：' +
      //     parms.data.value +
      //     '</br>' +
      //     '占比：' +
      //     parms.percent +
      //     '%'
      //   return str
      // }
    },
    // 图例
    legend: {
      data: TRAFFIC_LEGEND.map(item => item.label),
      orient: 'vertical',
      left: '70%',
      align: 'left',
      top: 'middle',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.702);'
      }
    },
    // 数据
    series: [
      {
        type: 'pie',
        center: ['35%', '50%'],
        radius: ['40%', '65%'],
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
    const carsData = this.data.map(item => {
      return {
        value: item.quantity,
        name: `${filterDict(
          item.runState,
          TRAFFIC_LEGEND,
          'label',
          'code'
        )}     35%`,
        itemStyle: {
          color: filterDict(item.runState, TRAFFIC_LEGEND, 'color', 'code')
        }
      }
    })
    // 饼图数据
    this.option.series[0].data = carsData
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
