<template>
  <el-dialog
    custom-class="dialog__wrapper"
    :visible.sync="show"
    :width="width"
    :top="top"
    modal-append-to-body
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="dialog"
    @close="handleClose"
    :title="title"
  >
    <!-- 内容区 -->
    <!-- @slot 对话框的内容 -->
    <slot></slot>
    <!-- 尾部 -->
    <div slot="footer" class="dialog__footer">
      <div class="dialog__footer--right">
        <!-- @slot 对话框底部 -->
        <slot name="footer"></slot>
        <div v-if="!$slots.footer">
          <el-button size="small" @click="show = false">取消</el-button>
          <el-button size="small" type="primary" @click="handleConfirm"
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator'
@Component({
  name: 'Dialog'
})
export default class BreadcrumbRoutes extends Vue {
  show = false
  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean
  // 宽度
  @Prop({ default: '30%' }) public readonly width!: string
  // margin-top 值
  @Prop({ default: '10vh' }) public readonly top!: string

  // 是否默认关闭
  @Prop({ default: true, type: Boolean })
  public readonly showClose!: boolean
  // 标题
  @Prop({ default: '' }) public readonly title!: string
  // 关闭
  handleClose() {
    this.$emit('close')
    this.show = false
  }
  // 确认
  handleConfirm() {
    this.$emit('confirm')
  }
  // 监听 - params
  @Watch('show', { deep: true })
  public watchShow(val: boolean) {
    this.$emit('input', val)
  }
  // 监听 - params
  @Watch('value', { deep: true, immediate: true })
  public watchValue(val: boolean) {
    this.show = val
  }
}
</script>
<style lang="less" scoped>
.dialog {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 20px;
    border-radius: 4px;
  }
  &__footer {
    padding: 0 20px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &--right {
      flex: 1;
    }
    &__close {
      cursor: pointer;
    }
  }
}
</style>
