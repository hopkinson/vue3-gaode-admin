// 配合table-curd使用
import { Component, Vue, PropSync, Prop, Ref } from 'vue-property-decorator'
@Component
export default class Table extends Vue {
  // 搜索参数 .sync
  @PropSync('params', { type: Object, default: () => {} }) props!: string
  // 是否只能预览
  @Prop({ type: Boolean, default: false }) public readonly onlyView!: boolean
  // 是否可以选择
  @Prop({ type: Boolean, default: false }) public readonly selection!: boolean

  // 删除操作
  handleDel(e: any) {
    this.$confirm('确定删除该内容？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$emit('del', e)
    })
  }
  // 浏览操作
  handleView(e: any) {
    this.$emit('view', e)
  }
  // 增加操作
  handleAdd() {
    this.$emit('add')
  }
  // 编辑操作
  handleEdit() {
    this.$emit('edit')
  }
}
