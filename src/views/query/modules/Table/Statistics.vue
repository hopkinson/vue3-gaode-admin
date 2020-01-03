<template>
  <table-statistics v-bind="$attrs" v-on="$listeners">
    <!-- 条件查询 -->
    <template slot="query">
      <slot></slot>
    </template>

    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item
            :label="`${dict[item.alarmType.toString()].label}告警次数`"
            v-for="(item, index) in props.row.alarmQuantities"
            :key="`${item.alarmType + index + Math.random()}`"
          >
            <span>{{ item.quantity }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column prop="companyName" label="归属单位"> </el-table-column>
    <el-table-column prop="carNo" label="车牌"> </el-table-column>
    <el-table-column prop="carNo" label="统计时段">
      <span slot-scope="scope" v-if="scope.row.beginDate"
        >{{ scope.row.beginDate | formatDay('YYYY-MM-DD') }} 至
        {{ scope.row.endDate | formatDay('YYYY-MM-DD') }}</span
      >
    </el-table-column>
  </table-statistics>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'
import MixinsTable from '@/mixins/table'
import TableStatistics from '@/components/Table.vue'
import { WARNGING } from '@/config/dict'
@Component({
  name: 'TableList',
  components: {
    TableStatistics
  }
})
export default class TableList extends Mixins(MixinsTable) {
  // 字典 - 类型
  dict = WARNGING.status
}
</script>
<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
