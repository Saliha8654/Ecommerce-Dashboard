import { createStore } from 'vuex'

const store = createStore({
  state: {
    users: [],         
    currentUser: null,
    loggedIn: false
  },
 
  mutations: {
    ADD_USER(state, newUser) {
      state.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(state.users))
    },
    SET_USERS(state, users) {
      state.users = users
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
      state.loggedIn=true
    },
    SET_LOGGED_IN(state, status) {
      state.loggedIn = status
    },
    LOGOUT(state) {
      state.currentUser = null
      state.loggedIn = false
    }
  },
  actions: {
    initializeUsers({ commit }) {
      const stored = JSON.parse(localStorage.getItem('users')) || []
      commit('SET_USERS', stored)
    },
    signup({ commit, state }, newUser) {
      const existing = state.users.find(user => user.email === newUser.email)
      if (existing) throw new Error('Email already exists')
      commit('ADD_USER', newUser)
    },
    login({ commit, state }, { email, password }) {
      const user = state.users.find(
        user => user.email === email && user.password === password
      )
      if (!user) throw new Error('Invalid email or password')

      commit('SET_CURRENT_USER', user)
      commit('SET_LOGGED_IN', true)
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('currentUser', JSON.stringify(user))
    },
    logout({ commit }) {
      commit('LOGOUT')
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('currentUser')
    },
    restoreSession({ commit }) {
      const loggedIn = localStorage.getItem('loggedIn') === 'true'
      const user = JSON.parse(localStorage.getItem('currentUser'))
      const users = JSON.parse(localStorage.getItem('users')) || []
      commit('SET_USERS', users)
      if (loggedIn && user) {
        commit('SET_CURRENT_USER', user)
        commit('SET_LOGGED_IN', true)
      }
    }
  },

   getters: {
  isLoggedIn: (state) => !!state.currentUser,
  isAdmin: state => state.currentUser?.role==='admin'}

})

export default store
