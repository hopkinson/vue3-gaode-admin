<template>
  <i class="sprite_ico sprite_ico_fullscreen fullscreen" @click="toggle"></i>
</template>

<script lang="ts">
import { toggleFull } from '@/utils/fullscreen'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FullScreenComponent'
})
export default class FullScreenComponent extends Vue {
  // 切换全屏
  toggle() {
    toggleFull()
  }
}
</script>

<style lang="less" scoped>
.fullscreen {
  margin: 0 30px 0 20px;
  cursor: pointer;
}
</style>
