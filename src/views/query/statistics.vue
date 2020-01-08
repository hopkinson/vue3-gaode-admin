<template>
  <div class="statistics" v-loading="loading">
    <table-statistics
      :data="data"
      v-model="params"
      @fetch="handleFetchData"
      title="违法行为统计"
    >
      <form-search v-model="params" @search="data = {}" />
    </table-statistics>
  </div>
</template>

<script lang="ts">
import TableStatistics from './modules/Table/Statistics.vue'
import FormSearch from './modules/Form/Statistics.vue'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { formatDay } from '../../utils/filters'

const TIME = new Date()
const YEAR = TIME.getFullYear()
const MONTH = TIME.getMonth() + 1
@Component({
  name: 'StatisticsComponent',
  components: {
    TableStatistics,
    FormSearch
  }
})
export default class StatisticsComponent extends Vue {
  // 列表数据
  data = {}

  // 加载loading
  loading: boolean = false

  params = {
    pageNum: '',
    pageSize: 10,
    beginDate: formatDay(`${YEAR}-${MONTH}-1`, 'YYYY-MM-DD'),
    endDate: ''
  }

  created() {
    this.params = Object.assign({}, this.params, {
      pageNum: 0
    })
  }

  // 请求数据
  async handleFetchData() {
    this.loading = true
    // 告警列表
    this.data = await this.$ajax.ajax({
      method: 'GET',
      url: 'v1/alarms/statistics',
      data: this.params,
      query: this.params
    })
    this.loading = false
  }
}
</script>

<style lang="less" scoped></style>
