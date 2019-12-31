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
    grid: {
      left: '5.5%',
      right: 18,
      bottom: '3%',
      top: 25,
      containLabel: true
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
          textStyle: {
            color: '#fff',
            fontSize: '12'
          }
        },
        type: 'value'
      }
    ],
    tooltip: {
      position: 'top',
      backgroundColor: 'transparent',
      formatter: function({ data }) {
        return `
        <div class="project__echarts--tooltip-bar">
            <span class="project__echarts--tooltip-car-text">${data.value}(${data.locateTime})</span>
        </div>`
      }
    },
    // x轴
    xAxis: {
      type: 'category',
      data: [],
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#fff',
        interval: 0
      },
      axisTick: {
        show: false,
        alignWithLabel: true
      }
    },
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
    this.$nextTick(() => {
      this.initData()
    })
  }

  //   初始化数据
  initData() {
    const _carNo = this.data.map(item => item.carNo)
    const _speedData = this.data.map(item => {
      return {
        value: Number(item.speed),
        locateTime: item.locateTime
      }
    })
    const _speed = _speedData.map(item => Number(item.value))
    const _maxSpeed = Math.max.apply(null, _speed)
    // 图表 - x轴
    this.option.xAxis.data = _carNo
    // 图表 - y轴
    this.option.series[0].data = _speedData
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
