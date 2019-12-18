<template>
  <el-form :model="form" size="small" label-position="left">
    <el-form-item label="隶属单位：" class="form__item">
      <el-select
        clearable
        popper-class="project__popup--inner"
        class="form__select"
        v-model="form.companyId"
      >
        <el-option
          class="form__select--option"
          v-for="item in companyList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="运行状态：" class="form__item">
      <el-select
        clearable
        popper-class="project__popup--inner"
        class="form__select"
        v-model="form.runState"
      >
        <el-option
          class="form__select--option"
          v-for="item in trafficDict"
          :key="item.value"
          :label="item.label"
          :value="item.code"
        >
          <span
            class="form__state--dot"
            :style="{ background: item.color }"
          ></span>
          <span class="form__state--label">{{ item.label }}</span>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { TRAFFIC_LEGEND } from '@/config/dict'
import { CompanyBody } from '@/services'
interface Form {
  companyId: string
  runState: string
}
@Component({
  name: 'TrackComponent',
  inheritAttrs: false
})
export default class TrackComponent extends Vue {
  // 单位列表
  @Prop({ type: Array, default: () => [] }) public readonly companyList!: Array<
    CompanyBody
  >
  form = {
    companyId: '',
    runState: ''
  }
  trafficDict = Object.values(TRAFFIC_LEGEND) // 字典 - 交通状况
  optionsCompany: Array<any> = [] // 隶属单位
  optionsRunState: Array<any> = [] // 运行状态

  // 监听 - params
  @Watch('form', { deep: true })
  public watchForm(val) {
    this.$emit('change-filter', val)
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
  &__item {
    display: flex;
    align-items: center;
    & /deep/ .el-form-item__content {
      flex: 1;
    }
  }
  &__select {
    width: 100%;
    &--option {
      &.is-empty {
        border-bottom: 1px solid #202f4c;
      }
      &.hover,
      &:hover {
        background-color: #1e345f;
        color: #fff;
      }
    }
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
    &--dot {
      border-radius: 50%;
      background-color: rgb(34, 168, 238);
      width: 8px;
      display: inline-block;
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
