<template>
  <div>
    <!-- <div class="car__filter">
      <el-checkbox v-model="checked">选择全部</el-checkbox>
      <span
        class="project__car-status"
        :class="[`is-${item.value}`]"
        v-for="(item, index) in dict"
        :key="index"
      ></span>
    </div>-->
    <div class="car__tip">
      车辆总计：
      <strong>123辆</strong>
    </div>
    <el-table
      ref="table"
      class="table"
      :data="data"
      :row-key="rowKey"
      header-row-class-name="project__table--header"
      row-class-name="project__table--row"
      @selection-change="selectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="reserveSelection"
        :selectable="selectable"
        v-if="showSelection"
      ></el-table-column>
      <el-table-column label="状态">
        <span
          class="project__car-status"
          :class="[`is-${filterDict(scope.row.status, dict, 'value', 'code')}`]"
          slot-scope="scope"
        ></span>
      </el-table-column>
      <el-table-column label="单位" prop="beginDate"></el-table-column>
      <el-table-column label="车牌号" prop="beginDate"></el-table-column>
      <el-table-column label="操作">
        <el-button
          slot-scope="scope"
          type="primary"
          size="mini"
          plain
          @click="$emit('play', scope.row)"
          >轨迹回放</el-button
        >
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage3"
      :pager-count="6"
      layout="prev, pager, next, jumper"
      :total="50"
      :page-size="10"
      small
    ></el-pagination>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop, Ref } from 'vue-property-decorator'
import { TRAFFIC_LEGEND } from '@/config/dict'
import { filterDict } from '@/utils/filters'
@Component({
  name: 'TableList'
})
export default class TableList extends Vue {
  @Ref() readonly table!: any
  // 字典 - 类型
  dict = TRAFFIC_LEGEND
  // 列表数据
  @Prop({ type: Array, default: () => [] }) readonly data!: Array<any>
}
</script>
<style lang="less" scoped>
.car {
  &__tip {
    font-size: 12px;
    color: rgb(255, 255, 255);
    margin-bottom: 12px;
  }
}
</style>
