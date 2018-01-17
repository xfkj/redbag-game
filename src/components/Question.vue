<template lang="pug">
.container.animated.fadeIn
  .animated.bounceInDown(v-if="Q.title && !signup")
    .content(v-html="Q.content")
    input.input(type="text" placeholder="(￣ー￣)" v-model.trim="input" :style="input_style" :disabled="bingo")
  SignUp.animated.bounceInDown(v-if="signup" :cs="CS" @close="signup=false")

  .msg.animated.fadeIn(v-if="msg && !signup") {{msg}}

  .footer(:style="footer_style")
    small.prize.animated.fadeIn(v-if="bingo") 正确！+{{this.Q.prize/100}}元
    button(@touchstart="draw") {{CS.get('amount')/100}}元
    button(v-if="bingo" @touchstart="get_question(CS)") 下一关
</template>

<script>
import axios from 'axios'
import {Student, get_cs, get_question, answer_right} from 'api/students'
import {set_page_title, toast} from '@/utils'

import {Indicator} from 'mint-ui'

import SignUp from './SignUp'

export default {
  data() {
    return {
      CS: new Student(),
      Q: {},
      input: null,
      bingo: false,
      signup: false,
      msg: null,
      footer_style: null,
    }
  },
  computed: {
    input_style() {
      if(!this.input) return null;
      const reg = new RegExp(`^${this.input}`, 'i')
      const fixed = reg.test(this.Q.answer)
      return {
        color: fixed ? '#52c41a' : '#f5222d'
      }
    }
  },
  watch: {
    input(val) {
      if (val === this.Q.answer) {
        Indicator.open()
        answer_right(this.CS, this.Q).then(
          () => {
            this.bingo = true
            Indicator.close()
            toast(`获得${this.Q.prize/100}元！`)
          }, (err) => {
            Indicator.close()
            toast('玩的人太多啦，请稍后重试...')
          }
        )
      }
    },
    Q() {
      this.input = null
      this.bingo = false
    }
  },
  async created() {
    const h = document.documentElement.clientHeight
    this.footer_style = {top: h - 30 + 'px'}
    if (!Cookies.get('openid')) {
      Cookies.set('openid', 'ogwQq1dwtjtWLANgde3MLKDsXZ8I', {expires: 7})
    }
    this.CS = await get_cs(Cookies.get('openid'))
    this.get_question(this.CS)
  },
  methods: {
    async get_question(student) {
      if (!student.id) return false;
      try {
        this.Q = await get_question(student)
        const {title, prize} = this.Q
        set_page_title(`${title} -- ${prize/100}元！`)
      } catch (err) {
        this.Q = {}
        this.msg = err.message
      }
    },
    draw() {
      if(this.CS.get('amount') < 100)
        return toast('余额大于1元才能领取');
      if (!this.CS.get('mobile'))
        return this.signup = true;
      axios.post('/draw', {
        openid: this.CS.get('openid'),
        amount: this.CS.get('amount')
      }).then(
        () => this.CS.save({amount: 0})
      ).then(
        () => toast('钱已经发送到你的微信红包啦！')
      ).catch(
        err => toast('稍等，财务正在充钱...')
      )
    }
  },
  components: {SignUp}
}
</script>

<style scoped>
.container {
  background-image: url('https://orig00.deviantart.net/4570/f/2011/139/a/9/dark_tower_by_sedeptra-d3fnq5y.jpg');
  font-size: 18px;
}
.content {
  padding: 8px;
  line-height: 1.8;
}
.input {
  width: 100%;
  display: block;
  text-align: center;
  font-size: 20px;
  transition: .7s all;
  margin-top: 8px;
}
.footer {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: rgba(0,0,0, 0.85);
  color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid goldenrod;
  color: goldenrod;
  line-height: 30px;
  height: 30px;
}
.footer button {
  font-weight: bold;
}
.prize {
  position: absolute;
  bottom: 34px;
  left: 4px;
}
</style>


