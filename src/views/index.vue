<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Login',
  components: {}
})
export default class Login extends Vue {}
</script>

<style lang="less" scoped></style>
