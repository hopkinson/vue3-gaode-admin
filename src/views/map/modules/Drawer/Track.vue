<template>
  <el-drawer
    :modal="false"
    :visible.sync="value"
    direction="btt"
    @input="$emit('input', value)"
  >
    <div class="track">
      <div class="track__item">
        <form-track></form-track>
      </div>
      <div class="track__item">
        <slider-track
          v-bind="$attrs"
          ref="slider"
          v-on="$listeners"
        ></slider-track>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'
import FormTrack from '../Form/Track.vue'
import SliderTrack from '../Slider/Track.vue'
@Component({
  name: 'DrawerTrack',
  components: {
    FormTrack,
    SliderTrack
  }
})
export default class DrawerTrack extends Vue {
  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean
}
</script>

<style lang="less" scoped>
.track {
  background: #000;
  &__item {
    height: 60px;
    display: flex;
    align-items: center;
    border-top: 1px solid #1a1a1b;
  }
}
</style>
