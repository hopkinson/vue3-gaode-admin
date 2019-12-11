<template>
  <div class="info">
    <div class="info__header"></div>
    <div class="info__main">
      <h6>粤A3KX62</h6>
      <div class="info__submit" @click="$emit('playback', data)">轨迹回放</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'CarDetail',
  inheritAttrs: false
})
export default class CarDetail extends Vue {
  @Prop({ default: () => {}, type: Object }) public readonly carDetail!: any
}
</script>

<style lang="less" scoped>
.info {
  position: relative;
  &__main {
    color: #fff;
  }
  &__submit {
  }
}
</style>
