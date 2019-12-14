<template>
  <!-- :visible.sync="drawer"  -->
  <el-drawer direction="btt">
    <!-- 头部 - 菜单 -->

    <!-- 2.播放控制 -->
    <div class="track">
      <!--  -->
      <!-- 2.3滑块 -->
      <el-slider v-model="value1"></el-slider>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'ProgressTrack'
})
export default class ProgressTrack extends Vue {}
</script>

<style lang="scss" scoped></style>
