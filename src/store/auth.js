import axios from 'axios'
import router from '@/router'

export default {
    namespaced: true,

    state: {
        token: null,
        user: null,
        role: null,
        profile: [],
    },

    getters: {
        authenticated(state) {
            return state.token && state.user
        },
        hasRole: (state) => (role) => {
            return state.user && state.user.role === role
        },
        user(state) {
            return state.user
        },
        profile(state) {
            return state.profile
        },
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_USER(state, data) {
            state.user = data
        },
        SET_PROFILE(state, data) {
            state.profile = data
        },
        SET_ROLE(state, data) {
            state.role = data
        },
    },

    actions: {
        async attempt({ commit, state }, token) {
            if (token) {
                commit('SET_TOKEN', token)
            }
            if (!state.token) {
                return
            }
            try {
                let response = await axios.get('/me')
                if (response.status === 200) {
                    commit('SET_USER', response.data)
                    // console.log(response.data)
                    router.replace({
                        name: 'Home',
                    })
                }
            } catch (error) {
                commit('SET_TOKEN', null)
                commit('SET_USER', null)
            }
        },
        async masuk({ dispatch }, credential) {
            try {
                let response = await axios.post('/login', credential)
                if (response.status === 200) {
                    await dispatch('attempt', response.data.token)
                } else {
                    return response
                }
            } catch (error) {
                return error.response
            }
        },
        async logout({ commit }) {
            return axios
                .get('/logout')
                .then(() => {
                    commit('SET_TOKEN', null)
                    commit('SET_USER', null)
                    commit('SET_ROLE', null)
                    router.replace({ name: 'Login' })
                })
                .catch((error) => {
                    // Tangani kesalahan di sini
                    console.error('Logout error:', error)
                    // Misalnya, tampilkan pesan kesalahan kepada pengguna
                    // atau lakukan tindakan lain sesuai kebutuhan Anda
                })
        },

        async getUser({ commit }) {
            try {
                let response = await axios.get('/profile')
                if (response.status === 200) {
                    commit('SET_PROFILE', response.data)
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
}
