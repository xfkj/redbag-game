import Vue from 'vue'
import Vuex from 'vuex'
import Student from 'api/students/Student'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cs: new Student()
  },
  mutations: {
    set_cs(state, student) {
      state.cs = student
    }
  },
  actions: {
    get_cs({commit}, openid) {
      Student.current(openid).then(s => {
        commit('set_cs', s)
      })
    }
  },
})
