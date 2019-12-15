<template>
  <div class="detail">
    <div class="sprite_ico sprite_ico_popup_detail__header">
      <i class="iconfont icon-guanbi detail--close"></i>
    </div>
    <div class="detail__main">
      <h6>粤A3KX62</h6>
      <p>
        状态：
        <span>违停</span>
      </p>
      <p>隶属单位：市政府交通厅</p>
      <p>汽车类别：便民车</p>
      <p>速度时间：45km/h</p>
      <p>最后定位：暂无</p>
      <p>定位时间：2019-11-23 16:22</p>
      <div class="detail--button" @click="$emit('play-track', data)">
        轨迹回放
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'CarDetail',
  inheritAttrs: false
})
export default class CarDetail extends Vue {
  @Prop({ default: () => {}, type: Object }) public readonly carDetail!: any
}
</script>

<style lang="less" scoped>
.detail {
  position: relative;
  &__main {
    color: #fff;
  }
  &__submit {
  }
  &--close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 13px;
    color: #0ccfdd;
  }
  &--button {
    width: 66px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background: transparent;
    color: rgb(34, 168, 238);
    font-size: 12px;
    border: 1px solid rgb(34, 168, 238);
  }
}
</style>
