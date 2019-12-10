<template>
  <layout :footer="false" :breadcrumb="false">
    <router-view></router-view>
  </layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Layout from '@/layouts/default.vue'
@Component({
  name: 'Login',
  components: {
    Layout
  }
})
export default class Login extends Vue {}
</script>

<style lang="less" scoped></style>
