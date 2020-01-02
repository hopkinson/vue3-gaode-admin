<template>
  <layout aside> </layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Layout from '@/layouts/default.vue'
@Component({
  name: 'BaseInfoComponent',
  components: {
    Layout
  }
})
export default class BaseInfoComponent extends Vue {
  created() {}
}
</script>

<style lang="less" scoped></style>
