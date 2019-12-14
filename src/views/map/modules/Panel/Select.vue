<template>
  <div class="chart">
    <div class="sprite_ico sprite_ico_select_header"></div>
    <div class="chart__inner">
      <slot></slot>
    </div>
    <div class="sprite_ico sprite_ico_select_footer"></div>
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
  background: #020215;
  &__inner {
    position: relative;
    border-left: 1px solid #0f6980;
    border-right: 1px solid #0f6980;
    background: #020215;
  }
}
</style>
