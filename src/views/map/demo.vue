<template>
  <div class="container">
    <div class="wave ripple danger">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="content">
        <i class="fa fa-bell"></i>
      </div>
    </div>
  </div>
</template>

<style>
/************以下为具体实现************/

.wave {
  position: relative;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 28px;
}

.wave .circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
}

/* 波纹效果 */
.wave.ripple .circle {
  width: calc(100% - 6px); /* 减去边框的大小 */
  height: calc(100% - 6px); /* 减去边框的大小 */
  border: 3px solid #fff;
}

.wave.ripple .circle:first-child {
  animation: circle-opacity 2s infinite;
}

.wave.ripple .circle:nth-child(2) {
  animation: circle-opacity 2s infinite;
  animation-delay: 0.3s;
}

.wave.ripple .circle:nth-child(3) {
  animation: circle-opacity 2s infinite;
  animation-delay: 0.6s;
}

.wave.ripple.danger {
  color: red;
}

.wave.ripple.danger .circle {
  border-color: red;
}

.wave.ripple.warning {
  color: orange;
}
</style>

<script>
module.exports = {
  data: function() {
    let self = this

    return {
      zoom: 12,
      center: [121.59996, 31.197646],
      markers: [],
      markerRefs: [],
      events: {
        init(o) {
          setTimeout(() => {
            console.log(self.markerRefs)
            let cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
              gridSize: 80,
              renderCluserMarker: self._renderCluserMarker
            })
            console.log(cluster)
          }, 1000)
        }
      }
    }
  },

  created() {
    let self = this
    let markers = []
    let index = 0

    let basePosition = [121.59996, 31.197646]

    while (++index <= 30) {
      markers.push({
        position: [basePosition[0] + 0.01 * index, basePosition[1]],
        content:
          '<div style="text-align:center; background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        events: {
          init(o) {
            self.markerRefs.push(o)
          }
        }
      })
    }

    this.markers = markers
  },

  methods: {
    _renderCluserMarker(context) {
      const count = this.markers.length

      let factor = Math.pow(context.count / count, 1 / 18)
      let div = document.createElement('div')
      let Hue = 180 - factor * 180
      let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
      let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
      let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
      div.style.backgroundColor = bgColor
      let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    }
  }
}
</script>
<style>
.amap-page-container {
  width: 100%;
  height: 100%;
}
</style>
