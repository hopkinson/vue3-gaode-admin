<template>
  <div class="status">
    <!-- 查询车辆的表单 -->
    <div class="status__form">
      <!-- 输入车牌号会在地图上显示 -->
      <!--  @select="select" -->
      <el-input
        class="status__form--autocomplete"
        v-model="carNo"
        placeholder="输入车牌号查询"
      >
        <template slot="suffix">
          <i
            v-if="carNo.length"
            class="el-icon-circle-close el-input__icon status__form--search"
            @click="carNo = ''"
          ></i>
          <i
            class="el-icon-search el-input__icon status__form--search"
            @click="handleSearch"
          ></i>
        </template>
      </el-input>
      <!-- 按钮-筛选（显示与不显示） -->
      <el-button
        @click="handleSelect"
        class="status__form--button"
        :class="{ 'is-active': value }"
      >
        <div class="status__form--button-inner">
          <i class="iconfont icon-qiche"></i>
          <span class="status__button--text">筛选</span>
          <i
            :class="[
              `el-icon-caret-${value ? 'top' : 'bottom'}`,
              `status__button--arrow-${value ? 'focus' : 'normal'}`
            ]"
          ></i>
        </div>
      </el-button>
    </div>
    <!-- 筛选（具体信息显示） -->
    <panel-select v-if="value" class="status__panel">
      <!-- 筛选-条件 -->
      <form-car v-bind="$attrs" v-on="$listeners"></form-car>
      <!-- 筛选-表格展示 -->
      <table-car v-bind="$attrs" v-on="$listeners"></table-car>
    </panel-select>
  </div>
</template>

<script lang="ts">
import PanelSelect from '../Panel/Select.vue'
import TableCar from '../Table/Car.vue'
import FormCar from '../Form/Car.vue'
import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator'
@Component({
  name: 'SearchCarStatus',
  inheritAttrs: false,
  components: {
    PanelSelect,
    FormCar,
    TableCar
  }
})
export default class SearchCarStatus extends Vue {
  // v-model
  @Model('input', { type: Boolean, default: false })
  public readonly value!: boolean
  // 是否有车牌号
  hasSearchWord: boolean = false
  // 车牌号
  carNo: string = ''
  // 筛选
  handleSelect() {
    this.$emit('input', !this.value)
  }

  // 搜索
  handleSearch() {
    this.$emit('search', this.carNo)
    this.$emit('input', true)
  }
  // 监听 - params
  @Watch('value', {})
  public watchValue(val: string) {
    if (!val) {
      this.carNo = ''
    }
  }
}
</script>

<style lang="less" scoped>
.status {
  &__panel {
    margin-top: 10px;
  }
  &__form {
    display: flex;
    align-items: center;
    &--search {
      color: #73738e;
      font-weight: bold;
      cursor: pointer;
    }
    &--button {
      padding: 11px 12px;
      border-radius: 0;
      &.is-active {
        color: #22a8ee;
      }
      &-inner {
        display: flex;
        align-items: center;
        .iconfont {
          transform: scale(1.4);
        }
      }
    }
    &--autocomplete {
      margin-right: 10px;
      width: 295px;
      & /deep/ .el-input__inner {
        border-radius: 0;
      }
    }
  }
  &__button {
    &--text {
      padding: 0 10px 0 10px;
    }
    &--arrow {
      &-focus {
        font-size: 12px;
        color: rgb(34, 168, 238);
      }
      &-normal {
        font-size: 12px;
        color: 73738e;
      }
    }
  }
}
</style>
