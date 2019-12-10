<template>
  <div class="layout-detail">
    <div class="layout-detail__container">
      <slot></slot>
      <el-button
        v-if="showFooter"
        round
        @click="$router.back()"
        class="global__block--horizontal-center"
      >
        <i class="el-icon-back"></i> &nbsp; 返回
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'LayoutDetail'
})
export default class LayoutDetail extends Vue {
  // 是否显示底部
  @Prop({ default: true }) public readonly showFooter!: boolean
}
</script>

<style lang="less">
.layout-detail {
  &__btn {
    display: table;
    margin: 20px auto 10px;
  }
  &__text {
    letter-spacing: 5px;
  }
  &__container {
    padding: 20px;
    font-size: 0;
    max-width: 960px;
    margin: 0 auto;
    background-color: #fff;
    label {
      color: #99a9bf;
      width: 90px;
      text-align: right;
    }
    .el-form-item {
      margin: 10px 0;
      width: 100%;
      display: flex;
    }
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
