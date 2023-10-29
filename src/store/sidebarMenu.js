import axios from 'axios'

export default {
    namespaced: true,

    state: {
        menus: [],
        menu: [],
        menu_role: [],
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

                // Memanggil mutation untuk mengatur data menu
                commit('SET_MENU', data.data)

                // Memanggil mutation untuk mengatur data paginasi
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
                // console.log('Data yang diterima dari API:', data)
            } catch (error) {
                console.error(error)
            }
        },

        async fetchMenus({ commit }) {
            try {
                const response = await axios.get(`/menu`)
                const menus = response.data.data // Pastikan respons API sesuai dengan struktur ini
                commit('SET_MENUS', menus)
            } catch (error) {
                console.error(error)
            }
        },
        async createMenu({ dispatch }, menuData) {
            try {
                // Kirim data menu baru ke backend
                const response = await axios.post(`/menu`, menuData)

                // Jika berhasil, panggil action fetchMenus untuk memperbarui daftar menu
                dispatch('fetchMenus')

                // Anda juga bisa menangani respons lainnya atau memberikan notifikasi sukses
                console.log('Menu berhasil dibuat:', response.data.data)
            } catch (error) {
                console.error('Gagal membuat menu:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
        async createMenuRole({ dispatch }, menuRoleData) {
            try {
                // Kirim data menu baru ke backend
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
                commit('SET_MENUS', response.data.data) // Perbarui daftar menu setelah menghapus menu
                console.log('Menu berhasil dihapus:', response.data.data)
                dispatch('fetchMenus') // Perbarui daftar menu setelah menghapus menu
            } catch (error) {
                console.error('Gagal menghapus menu:', error)
                throw error
            }
        },
        async updateMenu({ commit, dispatch }, { id, menuData }) {
            try {
                const response = await axios.put(`/menu/${id}`, menuData) // Mengirim permintaan PUT
                // Perbarui daftar menu setelah berhasil mengubah menu
                commit('SET_MENUS', response.data.data)
                // Tampilkan notifikasi sukses atau lakukan tindakan lain yang sesuai
                console.log('Menu berhasil diubah:', response.data.data)

                // Perbarui daftar menu setelah berhasil mengubah menu
                dispatch('fetchMenus')
            } catch (error) {
                console.error('Gagal mengubah menu:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
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
                // Tangani kesalahan
                console.error('Kesalahan dalam permintaan getMenuRoles:', error)
                throw error
            }
        },
        //BERFUNGSI UNTUK MENGATUR PERMISSION SETIAP ROLEH YANG DIPILIH
        async setMenuRoles({ commit }, payload) {
            try {
                const response = await axios.post(`menu/set-menu-role`, payload)

                return response.data
            } catch (error) {
                // Tangani kesalahan
                console.error(
                    'Kesalahan dalam permintaan setRolePermission:',
                    error
                )
                throw error
            }
        },
    },
}
