<template>
  <div class="layout-form">
    <div class="layout-form__container">
      <div v-loading="loading">
        <slot></slot>
      </div>
      <div class="global__block--horizontal-center">
        <el-button
          type="primary"
          @click="handleSubmit"
          :disabled="loading"
          round
          plain
        >
          <i class="el-icon-thumb"></i>&nbsp; 保存
        </el-button>
        <el-button @click="handleBack" :disabled="loading" round>
          <i class="el-icon-back"></i> &nbsp; 返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'

@Component({
  name: 'LayoutDetail'
})
export default class LayoutDetail extends Vue {
  handleBack() {
    this.$router.back()
  }
  // 详情数据
  @Prop({ type: Object, default: () => {} }) readonly data!: object
  // 表单对象的key
  @Prop({ type: String, default: 'form' }) readonly formKey!: string
  // 详情数据
  @Prop({ type: Boolean, default: false }) readonly loading!: boolean
  // 禁止按钮
  @Prop({ type: Boolean, default: false }) readonly disabledButton!: Boolean

  // 表单提交
  handleSubmit() {
    const elFormRef = this.$children.find(item => {
      if (item.$options.name) {
        return item.$options.name.toUpperCase().includes('FORM')
      }
    })
    if (elFormRef) {
      const formRef = elFormRef.$children[0] as ElForm
      if (formRef) {
        formRef.validate((valid, object) => {
          const ruleCell = Object.keys(object)
          if (ruleCell.length) {
            const target = elFormRef.$refs[ruleCell[0]] as Vue
            target.$el.scrollIntoView(true)
          }
          valid && this.$emit('submit', (elFormRef as Vue)[this.formKey])
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.layout-form {
  &__container {
    max-width: 960px;
    margin: 0 auto;
    background: #fff;
    padding: 40px;
    padding-right: 60px;
  }
}
</style>
