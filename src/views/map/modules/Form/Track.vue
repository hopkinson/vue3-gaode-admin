<template>
  <el-form inline :model="form" size="small">
    <el-form-item label="车牌号码：">
      粤AXXXX
    </el-form-item>
    <el-form-item label="开始时间：">
      <el-date-picker v-model="form.beginDate" type="datetime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：">
      <el-date-picker v-model="form.endDate" type="datetime"> </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" size="mini">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'TrackComponent'
})
export default class TrackComponent extends Vue {
  form: any = {}
  onSubmit() {}
}
</script>

<style lang="scss" scoped></style>
