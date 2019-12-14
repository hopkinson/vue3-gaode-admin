<template>
  <div class="status">
    <!-- 查询车辆的表单 -->
    <div class="status__form">
      <!-- 输入车牌号会在地图上显示 -->
      <el-autocomplete
        class="status__form--autocomplete"
        popper-class="my-autocomplete"
        v-model="plate"
        :fetch-suggestions="querySearch"
        placeholder="输入车牌号查询"
        @select="select"
      >
        <i
          class="el-icon-search el-input__icon status__form--search"
          slot="suffix"
          @click="handleIconClick"
        >
        </i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.carNo }}</div>
        </template>
      </el-autocomplete>
      <!-- 按钮-筛选（显示与不显示） -->
      <el-button @click="handleSelect" class="status__form--button">
        <div class="status__form--button-inner">
          <i
            class="sprite_ico"
            :class="[`sprite_ico_icon_car_${isSelected ? 'focus' : 'normal'}`]"
          ></i>
          <span class="status__button--text">筛选</span>
          <i
            :class="[
              `el-icon-caret-${isSelected ? 'top' : 'bottom'}`,
              `status__button--arrow-${isSelected ? 'focus' : 'normal'}`
            ]"
          ></i>
        </div>
      </el-button>
    </div>
    <!-- 筛选（具体信息显示） -->
    <panel-select v-if="isSelected">
      <!-- 筛选-条件 -->
      <form-car></form-car>
      <!-- 筛选-表格展示 -->
      <table-car></table-car>
    </panel-select>
  </div>
</template>

<script lang="ts">
import PanelSelect from '../Panel/Select.vue'
import TableCar from '../Table/Car.vue'
import FormCar from '../Form/Car.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'SearchCarStatus',
  components: {
    PanelSelect,
    FormCar,
    TableCar
  }
})
export default class SearchCarStatus extends Vue {
  // 车牌列表
  @Prop({ type: Array, default: () => [] }) public readonly queryData!: Array<
    any
  >
  // 车牌号
  plate: string = ''
  isSelected: boolean = false
  // 筛选
  handleSelect() {
    this.isSelected = !this.isSelected
  }

  // 远程查询车牌号码
  querySearch(query, callback) {
    var results = query
      ? this.queryData.filter(item => item.carNo.includes(query))
      : this.queryData
    callback(results)
  }
}
</script>

<style lang="less" scoped>
.status {
  &__form {
    display: flex;
    align-items: center;
    &--search {
      color: #73738e;
      font-weight: bold;
    }
    &--button {
      padding: 11px 10px;
      border-radius: 0;
      &-inner {
        display: flex;
        align-items: center;
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
      padding: 0 10px 0 7px;
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
