<template>
  <el-form inline :model="form" size="small">
    <el-form-item label="车牌号码：">{{ carDetail.carNo }}</el-form-item>
    <el-form-item label="开始时间：">
      <el-date-picker
        class="form__date"
        v-model="form.beginTime"
        type="datetime"
        value-format="yyyy-MM-ddTHH:mm:ss"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：">
      <el-date-picker
        class="form__date"
        v-model="form.endTime"
        type="datetime"
        value-format="yyyy-MM-ddTHH:mm:ss"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button
        class="form__button"
        type="primary"
        @click="onSubmit"
        :disabled="!canSearch"
        size="mini"
        >查询</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { CarTrackBody } from '@/services'
import { CarIdBody } from '@/services'
@Component({
  name: 'TrackComponent'
})
export default class TrackComponent extends Vue {
  // 详情数据
  @Prop({ type: Object, default: () => {} }) readonly carDetail!: CarIdBody
  // 表单数据
  @Prop({ type: Object, default: () => {} }) readonly trackForm

  form: CarTrackBody = {
    carId: '',
    beginTime: '',
    endTime: ''
    // carId: '6',
    // beginTime: '2019-12-31T15:00:00',
    // endTime: '2019-12-31T17:00:00'
  }

  pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', new Date())
        }
      },
      {
        text: '昨天',
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', date)
        }
      }
    ]
  }
  // 能否查询 ：每个值都不能为空
  get canSearch() {
    return Object.values(this.form).every(i => i)
  }

  onSubmit() {
    this.$emit('search-track', this.form)
  }
  // 监听 - 倍速
  @Watch('trackForm', { deep: true })
  public async watchTrackForm(val: CarIdBody) {
    this.$nextTick(() => {
      this.form = Object.assign({}, this.form, val)
    })
  }
  // 监听 - 倍速
  @Watch('carDetail', { deep: true, immediate: true })
  public async watchForm(val: CarIdBody) {
    if (val) {
      this.form.carId = val.id
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  &__date {
    & /deep/ .el-input__inner {
      background-color: #1a1a1b;
      border-radius: 0;
      border: none;
      color: #fff;
    }
  }
  &__button {
    // background-color: rgb(34, 168, 238);
    width: 88px;
    border-radius: 0;
  }
}
</style>
