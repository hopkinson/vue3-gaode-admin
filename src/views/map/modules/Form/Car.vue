<template>
  <el-form :model="form" size="small">
    <el-form-item label="隶属单位：">
      <el-option v-model="form.value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        >
        </el-option>
      </el-option>
    </el-form-item>
    <el-form-item label="运行状态：">
      <el-option v-model="form.value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
          @change="onSubmit"
        >
        </el-option>
      </el-option>
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
  options = []
  onSubmit() {}
}
</script>

<style lang="scss" scoped></style>
