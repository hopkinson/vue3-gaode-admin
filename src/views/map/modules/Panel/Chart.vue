<template>
  <div class="chart">
    {{ titleStyle }}
    <div
      class="chart__title sprite_ico"
      :class="`sprite_ico_panel_${size}-header`"
    >
      <span :style="titleStyle">{{ title }}</span>
    </div>
    <div class="chart__inner" :style="chartStyle">
      <div class="chart__unit chart__unit--position">{{ unit }}</div>
      <div class="chart__link chart__link--position">
        <slot name="link"></slot>
      </div>
      <slot></slot>
    </div>
    <div
      class="chart__footer sprite_ico"
      :class="`sprite_ico_panel_${size}-footer`"
    ></div>
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
  @Prop({ default: '', type: String }) public readonly size!: string
  // 高度
  @Prop({ default: 280, type: Number }) public readonly height!: number
  // 图表样式
  get chartStyle() {
    const { size, height } = this
    const SIZE = {
      big: 406,
      small: 381
    }
    return {
      width: `${SIZE[size] / 191.7}rem`,
      height: `${height / 191.7}rem`
    }
  }
  // 标题样式
  get titleStyle() {
    const { size } = this
    const LEFT = {
      big: '50%',
      small: '53.5%'
    }
    return {
      left: `${LEFT[size]}`
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  font-size: 0;
  &__title {
    text-align: center;
    color: rgb(255, 255, 255);
    font-weight: bold;
    font-size: 18px;
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
    height: 28px;
  }
  &__inner {
    position: relative;
    border-left: 1px solid #0f6980;
    border-right: 1px solid #0f6980;
    background: #020215;
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
    font-size: 12px;
    &--position {
      position: absolute;
      top: -16px;
      left: 24px;
    }
  }
}
</style>
