<template lang="pug">
.container.animated.fadeIn
  .msg.animated.fadeIn(v-if="msg") {{msg}}
  router-link.start.animated.fadeInUp(to="/question" v-if="area.name") 开 始
</template>

<script>
import AV from 'api/AV'
import {get_area} from 'api/areas'
import {set_page_title} from '@/utils'

import {Indicator} from 'mint-ui'

export default {
  data() {
    return {
      area: {},
      msg: null,
    }
  },
  async created() {
    set_page_title('非凡教育，伴你同行！')
    let point
    if (Cookies.get('point')) {
      point = new AV.GeoPoint(Cookies.getJSON('point'))
    } else {
      try {
        Indicator.open({
         text: '地理位置获取中',
         spinnerType: 'triple-bounce'
        })
        const {latitude, longitude} = await AV.GeoPoint.current()
        Cookies.set('point', {latitude, longitude}, {expires: 1})
        point = new AV.GeoPoint(Cookies.getJSON('point'))
        Indicator.close()
      } catch (err) {
        Indicator.close()
        return this.msg = '地理位置获取失败，请刷新重试'
      }
    }
    try {
      this.area = await get_area(point)
      this.msg = `欢迎你，${this.area.name}的同学！`
    } catch (err) {
      return this.msg = err.message
    }
  }
}
</script>

<style scoped>
.container {
  background-image: url('./bg.png');
  text-align: center;
}
.start {
  display: block;
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 56px;
  font-size: 24px;
  color: rgba(255,255,255, .85);
}
</style>

