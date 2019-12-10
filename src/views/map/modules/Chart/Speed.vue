<template>
  <!-- 当天最高时速 -->
  <div ref="chart" class="chart"></div>
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
    series: [
      {
        type: 'bar',
        barMaxWidth: 10,
        itemStyle: {
          normal: {
            barBorderRadius: 15,
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: 'rgb(138,0,255)' },
              { offset: 0, color: 'rgb(0,246,255)' }
            ])
          }
        },
        data: []
      },
      {
        type: 'bar',
        barGap: '-100%',
        barWidth: 10,
        animation: false,
        z: -1,
        itemStyle: {
          color: '#071430',
          barBorderRadius: 15
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
    const _carNo = this.data.map(item => item.carNo)
    const _speed = this.data.map(item => Number(item.speed))
    const _maxSpeed = Math.max.apply(null, _speed)
    // 图表 - x轴
    this.option.xAxis.data = _carNo
    // 图表 - y轴
    this.option.series[0].data = _speed
    this.option.series[1].data = _speed.map(item => _maxSpeed)

    // 绘制图表
    const chart = this.$echarts.init(this.chart)

    chart.setOption(this.option)
    // 每隔一个小时执行一次
    setTimeout(() => {
      this.initData()
    }, 60 * 60 * 1000)
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
  width: 400px;
  height: 280px;
}
</style>
