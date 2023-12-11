import axios from 'axios'

export default {
    namespaced: true,

    state: {
        menus: [],
        menu: [],
        menu_role: [],
        role_menu: [],
        paginationData: {
            lastPage: '',
            currentPage: '',
            total: '',
            lastPageUrl: '',
            nextPageUrl: '',
            prevPageUrl: '',
            from: '',
            to: '',
        },
        tableHeader: {
            draw: 0,
            search: '',
            length: 5,
        },
        to: '',
        userRoles: [], // Tambahkan state untuk menyimpan peran pengguna
    },
    getters: {
        menus(state) {
            return state.menus
        },
        menu(state) {
            return state.menu
        },
        menu_role(state) {
            return state.menu_role
        },
        role_menu(state) {
            return state.role_menu
        },
        // Getter untuk mengakses tableHeader
        tableHeader(state) {
            return state.tableHeader
        },
        // Getter untuk mengakses data paginationData
        paginationData(state) {
            return state.paginationData
        },
    },
    mutations: {
        SET_MENUS(state, menus) {
            state.menus = menus
        },
        SET_MENU(state, menu) {
            state.menu = menu
        },
        SET_MENU_ROLE(state, menu_role) {
            state.menu_role = menu_role
        },
        SET_ROLE_MENU(state, role_menu) {
            state.role_menu = role_menu
        },
        SET_TABLE_HEADER_VALUE(state, tableHeader) {
            state.tableHeader = tableHeader
        },
        SET_PAGINATION_DATA(state, paginationData) {
            state.paginationData = paginationData
        },
        SET_TO(state, to) {
            state.to = to
        },
    },

    actions: {
        async loadMenus({ commit }, { url, tableHeader }) {
            try {
                const response = await axios.get(url, { params: tableHeader })
                const data = response.data.data

                commit('SET_MENU', data.data)
                commit('SET_PAGINATION_DATA', {
                    lastPage: data.last_page,
                    currentPage: data.current_page,
                    total: data.total,
                    lastPageUrl: data.last_page_url,
                    nextPageUrl: data.next_page_url,
                    prevPageUrl: data.prev_page_url,
                    from: data.from,
                    to: data.to,
                })
            } catch (error) {
                console.error(error)
            }
        },

        async fetchMenus({ commit }) {
            try {
                const response = await axios.get('/menus')
                const menus = response.data.data
                commit('SET_MENUS', menus)
            } catch (error) {
                console.error(error)
            }
        },

        async createMenu({ dispatch }, menuData) {
            try {
                const response = await axios.post('/menu', menuData)
                dispatch('fetchMenus')
                console.log('Menu berhasil dibuat:', response.data.data)
            } catch (error) {
                console.error('Gagal membuat menu:', error)
                throw error
            }
        },

        async createMenuRole({ dispatch }, menuRoleData) {
            try {
                const response = await axios.post(
                    '/menu/menu-role',
                    menuRoleData
                )
                dispatch('fetchMenus')
                console.log('Menu role berhasil dibuat:', response.data.data)
            } catch (error) {
                console.error(
                    'Gagal membuat menu role:',
                    error.response.data.error
                )
                throw error
            }
        },

        async deleteMenu({ commit, dispatch }, id) {
            try {
                const response = await axios.delete(`/menu/${id}`)
                commit('SET_MENUS', response.data.data)
                console.log('Menu berhasil dihapus:', response.data.data)
                dispatch('fetchMenus')
            } catch (error) {
                console.error('Gagal menghapus menu:', error)
                throw error
            }
        },

        async updateMenu({ commit, dispatch }, { id, menuData }) {
            try {
                const response = await axios.put(`/menu/${id}`, menuData)
                commit('SET_MENUS', response.data.data)
                console.log('Menu berhasil diubah:', response.data.data)
                dispatch('fetchMenus')
            } catch (error) {
                console.error('Gagal mengubah menu:', error)
                throw error
            }
        },

        async getMenuRoles({ commit }, payload) {
            try {
                const response = await axios.post(`menu/get-menu-role`, {
                    menu_id: payload,
                })

                if (response.status === 200 && response.data) {
                    commit('SET_MENU_ROLE', response.data.data)
                    return response.data
                } else {
                    throw error
                }
            } catch (error) {
                console.error('Kesalahan dalam permintaan getMenuRoles:', error)
                throw error
            }
        },
        async getRoleMenus({ commit }, payload) {
            try {
                const response = await axios.post(`menu/get-role-menu`, {
                    role_id: payload,
                })

                if (response.status === 200 && response.data) {
                    commit('SET_ROLE_MENU', response.data.data)
                    return response.data
                } else {
                    throw error
                }
            } catch (error) {
                console.error('Kesalahan dalam permintaan getMenuRoles:', error)
                throw error
            }
        },

        async setMenuRoles({ commit }, payload) {
            try {
                const response = await axios.post(`menu/set-menu-role`, payload)
                return response.data
            } catch (error) {
                console.error('Kesalahan dalam permintaan setMwnuRole:', error)
                throw error
            }
        },
        async setRoleMenus({ commit }, payload) {
            try {
                const response = await axios.post(`menu/set-role-menu`, payload)
                return response.data
            } catch (error) {
                console.error('Kesalahan dalam permintaan setRoleMenu:', error)
                throw error
            }
        },
    },
}
