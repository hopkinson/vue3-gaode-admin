<template>
  <i class="sprite_ico sprite_ico_fullscreen fullscreen" @click="toggle"></i>
</template>

<script lang="ts">
import { toggleFull, watchFull } from '@/utils/fullscreen'
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
@Component({
  name: 'FullScreenComponent'
})
export default class FullScreenComponent extends Vue {
  @Mutation('app/SET_FULLSCREEN_STATUS') setFullscreenState
  // 切换全屏
  toggle() {
    toggleFull()
  }

  mounted() {
    watchFull(document.documentElement, ev => {
      this.setFullscreenState(ev)
    })
  }
}
</script>

<style lang="less" scoped>
.fullscreen {
  margin: 0 30px 0 20px;
  cursor: pointer;
}
</style>
