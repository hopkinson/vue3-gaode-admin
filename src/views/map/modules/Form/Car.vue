<template>
  <el-form :model="form" size="small">
    <el-form-item label="隶属单位：">
      <el-select
        popper-class="project__popup--inner"
        class="form__select"
        v-model="form.companyId"
        :visible-change="remoteCompany"
        :loading="loading"
      >
        <el-option
          v-for="item in optionsCompany"
          :key="item.companyName"
          :label="item.companyName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="运行状态：">
      <el-select
        popper-class="project__popup--inner"
        class="form__select"
        v-model="form.runState"
        autocomplete
      >
        <el-option label="所有状态" :value="empty" />
        <el-option
          v-for="item in trafficDict"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <!-- <span class="form__state--dot" :style="{ background: item.color }"></span> -->
          <!-- <span class="form__state--label">{{ item.label }}</span> -->
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TRAFFIC_LEGEND } from '@/config/dict'
@Component({
  name: 'TrackComponent'
})
export default class TrackComponent extends Vue {
  // 单位列表
  @Prop({ type: Array, default: () => [] }) public readonly queryData!: Array<
    any
  >
  @Prop({ type: Function, default: () => {} })
  public readonly fetchCompany!: Function
  empty = ''
  form: any = {}
  trafficDict = Object.values(TRAFFIC_LEGEND) // 字典 - 交通状况
  loading: boolean = false // 加载中
  optionsCompany: Array<any> = [] // 隶属单位
  optionsRunState: Array<any> = [] // 运行状态

  // 远程搜索 - 单位
  async remoteCompany(status) {
    if (status && !this.optionsCompany.length) {
      this.loading = true
      this.optionsCompany = await this.fetchCompany()
      this.loading = false
    }
  }
}
</script>
<style lang="less">
.form {
  &__select {
    & /deep/ .el-input__inner {
      &::placeholder {
        color: green;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.form {
  &__select {
    width: 77%;
    & /deep/ .el-icon-arrow-up:before {
      content: '\e78f';
    }
    & /deep/ .el-input__inner {
      background-color: rgb(7, 23, 56);
      border-radius: 0;
      height: 30px;
      border: none;
      font-weight: bold;
      color: #fff;
      &::placeholder {
        color: red;
      }
    }
  }
  &__state {
    &--icon {
      border-radius: 50%;
      background-color: rgb(34, 168, 238);
      width: 8px;
      height: 8px;
    }
    &--label {
      color: rgba(255, 255, 255, 0.702);
      font-weight: bold;
      font-size: 14px;
      padding-left: 10px;
    }
  }
}
</style>
