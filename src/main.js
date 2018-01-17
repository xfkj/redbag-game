import Vue from 'vue'
import router from './router'
import FastClick from 'fastclick'
import 'mint-ui/lib/style.css'
import './main.css'

FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  template: '<router-view />',
})
