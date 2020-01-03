<template>
  <table-query v-bind="$attrs" v-on="$listeners" :show-selection="selection">
    <!-- 条件查询 -->
    <template slot="query">
      <slot></slot>
    </template>
    <el-table-column label="状态" width="100px">
      <span
        slot-scope="scope"
        :style="{ color: scope.row.readState ? '#333' : 'red' }"
        >{{ scope.row.readState ? '已读' : '未读' }}</span
      >
    </el-table-column>
    <!-- 表格数据 -->
    <el-table-column label="告警类型" width="100px">
      <span slot-scope="scope">{{
        dict[scope.row.type.toString()].label
      }}</span>
    </el-table-column>
    <el-table-column prop="address" width="350px" label="发生位置">
    </el-table-column>
    <el-table-column prop="carNo" label="发生时间">
      <span slot-scope="scope" v-if="scope.row.alarmTime">{{
        scope.row.alarmTime | formatDay('YYYY-MM-DD HH:mm:ss')
      }}</span>
    </el-table-column>
    <el-table-column prop="carNo" label="结束时间">
      <span slot-scope="scope" v-if="scope.row.closeTime">{{
        scope.row.closeTime | formatDay('YYYY-MM-DD HH:mm:ss')
      }}</span>
    </el-table-column>
    <el-table-column prop="carNo" label="车牌" width="150px"> </el-table-column>
    <el-table-column prop="companyName" label="归属单位"> </el-table-column>
    <!-- <el-table-column label="备注" prop="remark"></el-table-column> -->
    <el-table-column label="操作" v-if="!onlyView" width="100px">
      <template slot-scope="scope">
        <el-button @click="handleView(scope.row)" plain size="mini"
          >查看</el-button
        >
      </template>
    </el-table-column>
  </table-query>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'
import MixinsTable from '@/mixins/table'
import TableQuery from '@/components/Table.vue'
import { WARNGING } from '@/config/dict'
@Component({
  name: 'TableList',
  components: {
    TableQuery
  }
})
export default class TableList extends Mixins(MixinsTable) {
  // 字典 - 类型
  dict = WARNGING.status
}
</script>
