<template>
  <div class="abnormal">
    <table-abnormal
      :data="data"
      v-model="params"
      @fetch="hanldeFetchData"
      title="异常统计"
    >
      <form-search v-model="params" @search="data = {}" />
    </table-abnormal>
  </div>
</template>

<script lang="ts">
import TableAbnormal from './modules/Table/Abnormal.vue'
import FormSearch from './modules/Form/Abnormal.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'BaseInfoComponent',
  components: {
    TableAbnormal,
    FormSearch
  }
})
export default class BaseInfoComponent extends Vue {
  // 列表数据
  data = {}

  // 加载loading
  loading: boolean = false

  params = {
    pageNum: '',
    pageSize: 10,
    carNo: '',
    type: '',
    beginDate: '',
    endDate: ''
  }

  created() {
    this.params = Object.assign({}, this.params, {
      pageNum: 0
    })
  }

  // 请求数据
  async hanldeFetchData() {
    this.loading = true
    // 警告列表
    this.data = await this.$ajax.ajax({
      method: 'POST',
      url: 'v1/alarms/page',
      data: this.params,
      query: this.params
    })
    this.loading = false
  }
}
</script>

<style lang="less" scoped></style>
