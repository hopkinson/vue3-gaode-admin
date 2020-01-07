<template>
  <el-form :inline="true" :model="form" size="small" class="form">
    <el-form-item label="车牌号码">
      <el-input v-model="form.carNo" clearable></el-input>
    </el-form-item>
    <el-form-item label="告警类型">
      <el-select v-model="form.type" clearable>
        <el-option
          :key="index"
          :label="item.label"
          :value="item.code"
          v-for="(item, index) in dict"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="时间">
      <el-date-picker
        class="form__date"
        v-model="dateRange"
        type="daterange"
        range-separator="-"
        clearable
        time-arrow-control
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch" class="form__button"
        >查询</el-button
      >
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
    carNo: '',
    type: '',
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

  mounted() {
    this.form = Object.assign({}, this.form, this.value)
  }

  // v-model
  @Model('input', { type: Object, default: () => ({}) })
  public readonly value!: object

  @Emit('input')
  handleSearch() {
    const data = Object.assign({}, this.value, this.form, {
      pageNum: 1
    })
    this.$emit('search', data)
    return data
  }
}
</script>
<style lang="less" scoped>
@import url('./style.less');
</style>
