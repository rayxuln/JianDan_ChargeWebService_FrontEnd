import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        test1: "Hi~~~~",
        login: false
    },
    getters: {
        hasLogin: state => state.login
    },
    mutations: {
        login(state){
            state.login = true
        }
    }
})

