<template>
  <!-- :style="style" -->
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      style: {}
    }
  },
  mounted() {
    onresize = () => {
      this.resizeCenter()
    }
    this.resizeCenter()
  },
  methods: {
    resizeCenter() {
      const ratioX = window.innerWidth / 1920
      const ratioY = window.innerHeight / 1080
      const ratio = Math.min(ratioX, ratioY)
      this.style = {
        transform: `scale(${ratio})`,
        transformOrigin: 'left top',
        marginLeft: `${(window.innerWidth - 1920 * ratio) / 2}px`
      }
    }
  }
}
</script>
<style lang="less">
@import './assets/style/reset.less';
</style>
