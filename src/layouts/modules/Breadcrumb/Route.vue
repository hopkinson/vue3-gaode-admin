<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
    <el-breadcrumb-item
      replace
      v-for="(item, index) in paths"
      :key="index"
      :to="item.path"
      >{{ item.meta.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Route, RouteRecord } from 'vue-router'
import { Getter } from 'vuex-class'
@Component({
  name: 'BreadcrumbRoutes'
})
export default class BreadcrumbRoutes extends Vue {
  paths: Array<RouteRecord> = []
  @Watch('$route', { immediate: true })
  public handleChangeRoute(val: Route) {
    if (val) {
      const { matched } = val
      this.paths = matched
    }
  }
}
</script>
<style scoped>
.breadcrumb {
  font-size: 16px;
}
</style>
