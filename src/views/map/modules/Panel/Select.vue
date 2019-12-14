<template>
  <div class="chart">
    <div class="chart__title"></div>
    <div class="chart__inner">
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
export default class PanelComponent extends Vue {}
</script>

<style lang="less" scoped>
.chart {
  position: relative;
  font-size: 12px;
  width: 408px;
  &__title {
    background: url('/images/select_header.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 35px;
    position: relative;
  }
  &__footer {
    background: url('/images/select_footer.png') no-repeat;
    background-size: 100% 100%;
    height: 10px;
    width: 100%;
  }
  &__inner {
    width: 100%;
    position: relative;
    background: url('/images/select_main.png') repeat-y;
    background-size: 100%;
  }
}
</style>
