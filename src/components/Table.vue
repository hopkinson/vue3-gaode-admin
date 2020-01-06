<template>
  <div
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    class="table"
  >
    <!-- 头部 -->

    <div class="table__header">
      <div class="table__header--left">
        <!-- @slot 查询条件 -->
        <p>{{ title }}</p>
        <slot name="query"></slot>
      </div>
      <div class="table__header--right">
        <!-- @slot 按钮 -->
        <slot name="button"></slot>
        <el-button
          type="danger"
          size="small"
          @click="handleDel"
          :disabled="isEmptySelect"
          v-if="showSelection && delSection"
          >批量删除</el-button
        >
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      ref="table"
      :data="data[listKey]"
      :stripe="stripe"
      :highlight-current-row="highlightCurrentRow"
      class="table--inner"
      :row-key="rowKey"
      @selection-change="selectionChange"
      @row-click="handleRowClick"
      @select-all="handleSelectionAll"
    >
      <!-- 多选 -->
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="reserveSelection"
        :selectable="selectable"
        v-if="showSelection"
      ></el-table-column>
      <!-- @slot 表格内容 -->
      <slot></slot>
      <!-- @slot 结果为空时 -->
      <template slot="empty">
        <slot name="empty"></slot>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="table__page" v-if="showPagination">
      <el-pagination
        background
        :current-page="data[currentKey]"
        :total="data[totalKey]"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="data[pageSizeKey]"
        @current-change="handlePageChange($event, pageNumKey)"
        @size-change="handlePageChange($event, pageSizeKey)"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Model,
  Emit,
  Ref
} from 'vue-property-decorator'
import {
  rowCallbackParams,
  cellCallbackParams,
  ElTable
} from 'element-ui/types/table'
import { Params } from '@/typings/Params.d'
@Component({
  name: 'Table'
})
export default class Table extends Vue {
  @Ref() readonly table!: ElTable
  select: Array<any> = []
  loading: boolean = false

  // v-model: 传参数params（查列表）
  @Model('input', { type: Object, default: () => ({}) })
  public readonly value!: object

  // 动态选择（禁用/不禁用）
  @Prop({ type: Function, default: () => ({}) })
  public readonly selectable!: Function

  // 删除的标题
  @Prop({ type: String, default: '此操作将删除数据, 是否继续?' })
  readonly delTip!: string

  // 标题
  @Prop({ type: String, default: '' }) readonly title!: string

  // 列表数据
  @Prop({ type: Object, default: () => ({}) }) readonly data!: object

  // 显示批量删除
  @Prop({ type: Boolean, default: false }) readonly delSection!: boolean
  // 在数据更新之后保留之前选中的数据
  @Prop({ type: Boolean, default: false }) readonly reserveSelection!: boolean

  // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。
  @Prop({ type: Function, default: () => {} }) readonly rowKey!: Function

  // 是否为斑马纹 table
  @Prop({ type: Boolean, default: true }) readonly stripe!: boolean

  // 是否要高亮当前行 - 用于单选
  @Prop({ type: Boolean, default: false })
  readonly highlightCurrentRow!: boolean
  // 是否显示分页
  @Prop({ type: Boolean, default: true }) readonly showPagination!: boolean
  // 是否显示多选
  @Prop({ type: Boolean, default: false }) readonly showSelection!: boolean
  // params's key - 页数
  @Prop({ type: String, default: 'pageNum' }) readonly pageNumKey!: string
  // params's key - 每页请求的大小
  @Prop({ type: String, default: 'pageSize' }) readonly pageSizeKey!: string
  // params's key - 数据列表
  @Prop({ type: String, default: 'records' }) readonly listKey!: string
  // params's key - 总体大小
  @Prop({ type: String, default: 'total' }) readonly totalKey!: string
  // params's key - 当前页
  @Prop({ type: String, default: 'current' }) readonly currentKey!: string

  // 没有选中
  // TODO: 批量删除的时候采用
  get isEmptySelect() {
    return this.select.length <= 0
  }

  // @method 清空选择
  clearSelection() {
    this.table.clearSelection()
  }

  // @method 切换表格的选择
  toggleSelection(rows) {
    if (rows.length) {
      rows.forEach(row => {
        this.table.toggleRowSelection(row)
      })
    } else {
      this.table.clearSelection()
    }
    this.$emit('toggle-select', rows)
  }

  // 选项
  selectionChange(val: []) {
    this.select = val
    this.$emit('select', val)
  }
  // 改变当前页
  handlePageChange(value: number, key) {
    let _obj = {}
    Object.defineProperty(_obj, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    })
    this.$emit('input', Object.assign({}, this.value, _obj))
  }

  handleSelectionAll(val) {
    this.$emit('select-all', val)
  }

  // 点击表格 - 行
  handleRowClick(
    row: rowCallbackParams,
    column: cellCallbackParams,
    event: any
  ) {
    if (
      event.target.nodeName !== 'INPUT' &&
      event.target.className !== 'el-checkbox__inner'
    ) {
      // 解决冒泡问题
      this.$emit('row-click', row)
    }
  }

  handleDel() {
    this.$confirm(this.delTip, '提示', {
      confirmButtonText: '确定',
      iconClass: 'dialog__del--icon el-icon-info',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$emit('del-selection', this.select)
      this.select = []
    })
  }
  // 请求数据
  async handleFetchData(val: object) {
    this.loading = true
    await this.$emit('fetch', val)
    this.loading = false
  }

  // 监听 - params
  @Watch('value', { deep: true, immediate: true })
  public handleChangeRoute(val: Params.Pagination) {
    this.handleFetchData(val)
  }

  @Emit('input')
  handleSearch(val) {
    return Object.assign({}, this.value, val)
  }
}
</script>
<style lang="less" scoped>
.table {
  padding: 30px 40px;
  background: #fff;
  &__page {
    text-align: center;
    margin: 30px auto;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &--right {
      margin-bottom: 18px;
    }
    &--left {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: space-between;
      p {
        font-size: 22px;
        color: rgb(51, 51, 51);
        font-weight: bold;
        margin-bottom: 18px;
      }
    }
  }
  &--inner {
    border-top: 1px solid #ebeef5;
  }
}
</style>
