<template>
  <div class="abnormal" v-loading="loading">
    <table-abnormal
      :data="data"
      v-model="params"
      @fetch="handleFetchData"
      @view="viewData"
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
  name: 'AbnormalComponent',
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
  async handleFetchData() {
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
  async viewData(item) {
    this.loading = true
    // 1. 将未读设为已读
    if (!item.readState) {
      await this.$ajax.ajax({
        method: 'PUT',
        url: `v1/alarm/read/${item.alarmNumber}`
      })
    }
    setTimeout(() => {
      this.loading = false
      this.$router.push({
        path: '/map',
        query: {
          alarmId: item.id
        }
      })
    }, 500)
  }
}
</script>

<style lang="less" scoped></style>
