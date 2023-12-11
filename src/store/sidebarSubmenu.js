import axios from 'axios'

export default {
    namespaced: true,

    state: {
        submenus: [],
        submenu: [],
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
    },
    getters: {
        submenus(state) {
            return state.submenus
        },
        submenu(state) {
            return state.submenu
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
        SET_SUBMENUS(state, submenus) {
            state.submenus = submenus
        },
        SET_SUBMENU(state, submenu) {
            state.submenu = submenu
        },
        SET_TABLE_HEADER_VALUE(state, tableHeader) {
            state.tableHeader = tableHeader
        },
        SET_PAGINATION_DATA(state, paginationData) {
            state.paginationData = paginationData
        },
        CREATE_SUBMENU(state, newSubmenu) {
            // Menambahkan submenu baru ke array submenus
            state.submenus.push(newSubmenu)
        },
    },

    actions: {
        async loadSubmenus({ commit }, { url, tableHeader }) {
            try {
                const response = await axios.get(url, { params: tableHeader })
                const data = response.data.data

                // Memanggil mutation untuk mengatur data menu
                commit('SET_SUBMENU', data.data)

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
        async fetchSubmenus({ commit }) {
            try {
                const response = await axios.get(`/submenu`)
                const submenus = response.data.data // Pastikan respons API sesuai dengan struktur ini
                // console.log('Data dari API:', submenus)
                commit('SET_SUBMENUS', submenus)
            } catch (error) {
                console.error(error)
            }
        },
        async deleteSubmenu({ commit, dispatch }, id) {
            try {
                const response = await axios.delete(`/submenu/${id}`)
                commit('SET_SUBMENUS', response.data.data) // Perbarui daftar menu setelah menghapus menu
                console.log('Submenu berhasil dihapus:', response.data.data)
                dispatch('fetchSubmenus') // Perbarui daftar menu setelah menghapus menu
            } catch (error) {
                console.error('Gagal menghapus submenu:', error)
                throw error
            }
        },
        async createSubmenu({ dispatch }, submenuData) {
            try {
                // Mengirim permintaan POST dengan data submenu ke API
                const response = await axios.post('/submenu', submenuData)
                // Anda juga bisa menangani respons lainnya atau memberikan notifikasi sukses
                console.log('Submenu berhasil dibuat:', response.data.data)
            } catch (error) {
                console.error('Terjadi kesalahan saat membuat submenu:', error)
                throw error // Melemparkan kembali kesalahan untuk ditangani di komponen yang menggunakan fungsi ini
            }
        },
        async updateSubmenu({ commit, dispatch }, { id, submenuData }) {
            try {
                const response = await axios.put(`/submenu/${id}`, submenuData) // Mengirim permintaan PUT
                // Perbarui daftar menu setelah berhasil mengubah menu
                commit('SET_SUBMENUS', response.data.data)
                // Tampilkan notifikasi sukses atau lakukan tindakan lain yang sesuai
                console.log('Sub-Menu berhasil diubah:', response.data.data)

                // Perbarui daftar menu setelah berhasil mengubah menu
                dispatch('fetchMenus')
            } catch (error) {
                console.error('Gagal mengubah sub-menu:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
    },
}
