import Vue from 'vue'
import Vuex from 'vuex'
import http from "../http/index";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    semester:null,
    current_subject:null,
    visible:false,
    snackText:'',
    color:'',
    visibleModal:false,
    formEductions:['Контрактна', 'Державна'],
    formGroups:[],
    formPrograms:[],
  },
  mutations: {
    OPEN_SNACK(state, payload){
      state.visible = true
      state.snackText = payload.text
      state.color = payload.color
    },
    CLOSE_VISIBLE(state){
      state.visible = false
    },
    OPEN_MODAL(state){
      state.visibleModal = true
    },
    CLOSE_MODAL(state){
      state.visibleModal = false
    },
    ADD_GROUPS(state, group){
      state.formGroups = group
    },
    ADD_PROGRAMS(state, program){
      state.formPrograms.push(program)
    },
    CURRENT_SUBJECT(state, data){
      state.current_subject = data

    },
    CURRENT_SEMESTER(state, item){
      state.semester = item
    }
  },
  actions: {
    actionOpenSnack({commit}, payload){
      commit('OPEN_SNACK', payload)
      setTimeout(() => {
        commit('CLOSE_VISIBLE')
      }, 3000)
    },
    actionOpenModal({commit}){
      commit('OPEN_MODAL')
    },
    actionCloseModal({commit}){
      commit('CLOSE_MODAL')
    },
    actionGetGroup({commit}){
      http.get('/methodist/group/')
          .then(response => {
            commit('ADD_GROUPS', response.data)
          })
          .catch(error => {
            console.log(error)
          })
    },
    actionGetPrograms({commit}){
      http.get('/methodist/student/educational-programs/')
          .then(response => {
            response.data.map(i => {
              commit('ADD_PROGRAMS', i)
            })
          })
          .catch(error => {
            console.log(error)
          })
    }
  },
  getters: {
    getVisible(state){
      return state.visible
    },
    getTextMessage(state){
      return state.snackText
    },
    getVisibleModal(state){
      return state.visibleModal
    },
    getGroups(state){
      return state.formGroups
    },
    getPrograms(state){
      return state.formPrograms
    },
    getEducational(state){
      return state.formEductions
    },
    getColorSnack(state){
      return state.color
    }
  }
})
