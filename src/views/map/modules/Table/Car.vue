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
    <div class="table__tip">
      车辆总计：
      <strong>{{ tableData.total || 0 }}辆</strong>
    </div>
    <!---->
    <el-table
      ref="table"
      class="table"
      :data="tableData.records"
      header-align="center"
      align="center"
      header-cell-class-name="project__table--header"
      cell-class-name="project__table--row"
      @selection-change="selectionChange"
      row-key="id"
    >
      <!-- <el-table-column
        type="selection"
        width="25"
        reserve-selection
      ></el-table-column> -->
      <el-table-column label="状态" align="center" width="50px">
        <span
          class="project__car-status"
          :class="scope.row.runState | filterClass"
          slot-scope="scope"
        ></span>
      </el-table-column>
      <el-table-column label="单位" header-align="center">
        <el-tooltip
          slot-scope="scope"
          effect="dark"
          :content="scope.row.companyName"
          placement="top-start"
        >
          <span class="table__text--single">{{ scope.row.companyName }}</span>
        </el-tooltip>
      </el-table-column>
      <el-table-column
        label="车牌号"
        align="center"
        prop="carNo"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <span
          class="table__btn--track"
          @click="playTrack(scope.row)"
          slot-scope="scope"
          >轨迹回放</span
        >
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="table__pagination"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :total="tableData.total"
      :page-size="tableData.size"
      small
    ></el-pagination>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Mixins, Prop, Ref } from 'vue-property-decorator'
import { TRAFFIC_LEGEND } from '@/config/dict'
import { filterDict } from '@/utils/filters'
@Component({
  name: 'TableList',
  inheritAttrs: false,
  filters: {
    filterClass(val) {
      return `is-${filterDict(
        val,
        Object.values(TRAFFIC_LEGEND),
        'value',
        'code'
      )}`
    }
  }
})
export default class TableList extends Vue {
  @Ref() readonly table!: any
  // 字典 - 类型
  dict = TRAFFIC_LEGEND

  // 列表数据
  @Prop({ type: Boolean, default: false }) readonly hasSearchWord
  // 列表数据
  @Prop({ type: Object, default: () => {} }) readonly tableData

  handleCurrentChange(val) {
    this.$emit('current-change', val)
  }
  playTrack(row) {
    this.$emit('play', row)
  }

  selectionChange(val) {}
}
</script>
<style lang="less" scoped>
.table {
  &::before {
    content: none;
  }
  & /deep/ .el-table-column--selection .cell {
    padding: 0;
  }
  & /deep/ .el-table__empty-block {
    background: #020214;
  }
  &__tip {
    font-size: 12px;
    color: rgb(255, 255, 255);
    margin-bottom: 12px;
  }
  &__text {
    &--single {
      .text-ellipsis-multi-line(1);
    }
  }
  &__btn {
    &--track {
      display: inline-block;
      width: 66px;
      height: 21px;
      line-height: 19px;
      text-align: center;
      background: transparent;
      color: rgb(34, 168, 238);
      font-size: 12px;
      border: 1px solid rgb(34, 168, 238);
      cursor: pointer;
      &:hover {
        background: rgb(34, 168, 238);
        color: #fff;
      }
    }
  }
  &__pagination {
    background: transparent;
    margin-top: 30px;
    text-align: center;
    & /deep/ .btn-next,
    & /deep/ .btn-prev,
    & /deep/ .el-pager li {
      background-color: transparent;
      color: #fff;
    }
    & /deep/ .el-pager li.active {
      background-color: transparent;
      color: rgb(34, 168, 238);
    }
    & /deep/ .el-pagination__jump {
      color: #fff;
    }
    & /deep/ .el-input__inner {
      background: #020215;
      color: #fff;
    }
  }
}
</style>
