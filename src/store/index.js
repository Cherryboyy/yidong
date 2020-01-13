import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '../utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()//从缓存中读取数据
  },
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user//更新state里面的数据
      auth.setUser()//要将数据同步到缓存中
    },
    clearUser (state) {
      state.user = {}
      auth.delUser()//缓存中的数据也要清空
    }
  },
  actions: {},
  modules: {}
})
