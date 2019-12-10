<template>
  <div class="footer">
    <span>{{ data }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'FooterCopyright'
})
export default class FooterCopyright extends Vue {
  // 底部文字
  @Prop({ default: '' }) readonly data!: string
}
</script>

<style lang="less" scoped>
.footer {
  text-align: center;
  color: #333;
  font-size: 12px;
  height: 100%;
  &:after {
    content: '';
    height: 100%;
    vertical-align: middle;
    display: inline-block;
  }
}
</style>
