<template>
  <div class="chart">
    <div class="sprite_ico sprite_ico_select_header"></div>
    <div class="chart__inner">
      <slot></slot>
    </div>
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
  width: 407px;
  background: #020215;
  font-size: 0;
  &__inner {
    border-left: 1px solid #0f6980;
    border-right: 1px solid #0f6980;
    border-bottom: 1px solid #0f6980;
    background: #020215;
    padding: 0 20px 30px;
  }
}
</style>
