<template>
  <div class="status">
    <!-- 查询车辆的表单 -->
    <div class="status__form">
      <el-input placeholder="输入车牌号查询" v-model="plate">
        <i slot="prefix" class="status__form--seach el-icon-search"></i>
      </el-input>
      <el-option v-model="value" placeholder="筛选">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-option>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SearchCarStatus'
})
export default class SearchCarStatus extends Vue {
  // 车牌号
  plate: string = ''
}
</script>

<style lang="less" scoped></style>
