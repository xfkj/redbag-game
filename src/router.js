import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Question from '@/components/Question'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/question',
      name: 'question',
      component: Question
    }
  ]
})

export default router
