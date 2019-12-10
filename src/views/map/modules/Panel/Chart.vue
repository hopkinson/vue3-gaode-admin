<template>
  <div class="chart" :style="chartStyle">
    <div class="chart__title">
      <span>{{ title }}</span>
    </div>
    <div class="chart__inner">
      <div class="chart__unit chart__unit--position">{{ unit }}</div>
      <div class="chart__link chart__link--position">
        <slot name="link"></slot>
      </div>
      <slot></slot>
    </div>
    <div class="chart__footer"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'PanelChart'
})
export default class PanelComponent extends Vue {
  // 图标
  @Prop({ default: '', type: String }) public readonly title!: string
  // 图标
  @Prop({ default: '', type: String }) public readonly unit!: string
  // 宽度
  @Prop({ default: '400px', type: String }) public readonly width!: string
  // 高度
  @Prop({ default: '280px', type: String }) public readonly height!: string
  // 图表样式
  get chartStyle() {
    const { width, height } = this
    return {
      width,
      height
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  &__title {
    text-align: center;
    color: rgb(255, 255, 255);
    font-weight: bold;
    font-size: 18px;
    background: url('/images/panel_header.png') no-repeat;
    background-size: 100% 100%;
    height: 44px;
    position: relative;
    span {
      position: absolute;
      top: 40%;
      left: 53.5%;
      letter-spacing: 2px;
      transform: translate(-50%, -50%);
    }
  }
  &__footer {
    background: url('/images/panel_footer.png') no-repeat;
    background-size: 100% 100%;
    height: 28px;
  }
  &__inner {
    position: relative;
    background: url('/images/panel_main.png') repeat-y;
    background-size: 100%;
  }
  &__link {
    color: rgb(0, 253, 255);
    &--position {
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
  &__unit {
    color: rgba(255, 255, 255, 0.702);
    &--position {
      position: absolute;
      top: 0;
      left: 24px;
    }
  }
}
</style>
