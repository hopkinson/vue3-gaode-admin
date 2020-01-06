<template>
  <el-form :inline="true" :model="form" size="small">
    <el-form-item label="时间范围：">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        clearable
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Model,
  Watch,
  Emit,
  Prop
} from 'vue-property-decorator'

import { WARNGING } from '@/config/dict'

@Component({
  name: 'FormSearch'
})
export default class FormSearch extends Vue {
  // 搜索的表单
  form = {
    endDate: '',
    beginDate: ''
  }

  //   字典
  dict = Object.values(WARNGING.status)

  // 【set/get】日期的计算
  get dateRange() {
    return [this.form.beginDate, this.form.endDate]
  }
  set dateRange(val) {
    if (val) {
      this.form.beginDate = val[0]
      this.form.endDate = val[1]
    } else {
      this.form.beginDate = ''
      this.form.endDate = ''
    }
  }

  // v-model
  @Model('input', { type: Object, default: () => ({}) })
  public readonly value!: object

  @Emit('input')
  handleSearch() {
    this.$emit('search')
    return Object.assign({}, this.value, this.form, {
      pageNum: 1
    })
  }
}
</script>
