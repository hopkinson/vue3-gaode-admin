<template>
  <div class="cells">
    <div
      class="cell"
      @click="$emit('click', item)"
      v-for="(item, index) in data.records"
      :key="index"
    >
      <div class="cell__title">
        <span class="cell__dot" v-show="!item.readState"></span>
      </div>
      <div class="cell__main">
        <div class="cell__main--content">
          {{ item.carNo }}在{{ item.address
          }}{{ dict[item.type] ? dict[item.type].label : '' }}
        </div>
        <div class="cell__main--desc">
          {{ item.alarmTime | formatDay('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="cell__pagination"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :total="data.total"
      :page-size="data.size"
      small
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { WARNGING } from '@/config/dict'
@Component({
  name: 'CellAbnormalComponent'
})
export default class CellAbnormalComponent extends Vue {
  dict = WARNGING.status // 字典
  // 列表数据
  @Prop({ type: Object, default: () => {} }) readonly data
  handleCurrentChange(val) {
    this.$emit('current-change', val)
  }
}
</script>

<style lang="less" scoped>
.cell {
  position: relative;
  min-height: 70px;
  display: table;
  width: 100%;
  table-layout: fixed;
  color: #fff;
  &__title,
  &__main {
    display: table-cell;
    height: 100%;
    vertical-align: middle;
  }
  &__title {
    width: 20px;
  }
  &__main {
    width: calc(100%-20px);
    position: relative;
    border-bottom: 1px solid #2b2b3b;
    transition: 0.3s;
    cursor: pointer;
    &:hover {
      color: #22a8ee;
    }
    &--content {
      font-weight: bold;
      font-size: 14px;
      .text-ellipsis-multi-line(1);
    }
    &--desc {
      margin-top: 5px;
      font-size: 12px;
    }
  }
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgb(236, 47, 49);
    overflow: hidden;
    display: inline-block;
  }
  &__pagination {
    background: transparent;
    padding-top: 14px;
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
