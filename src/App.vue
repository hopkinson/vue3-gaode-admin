<template>
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
      this.$nextTick(() => {
        this.resizeCenter()
      })
    }
    this.resizeCenter()
  },
  methods: {
    resizeCenter() {
      let app = document.body
      let width = document.body.clientWidth
      app.style.zoom = `${width / 1920}`
      app.style.minHeight = '100%' //注意这里必须设置最小高度为100%要不然高度不能满屏
    }
  }
}
</script>
<style lang="less">
@import './assets/style/reset.less';
</style>
