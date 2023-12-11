import axios from 'axios'

export default {
    namespaced: true,
    state: {
        users: [], //MENAMPUNG LIST USER
        roles: [], //MENAMPUNG LIST ROLES
        userRoles: [], //MENAMPUNG LIST ROLES
        permissions: [], //MENAMPUNG LIST PERMISSION
        role_permission: [], //MENAMPUNG PERMISSION YANG DIMILIKI OLEH ROLE
        authenticated: [], //MENAMPUNG USER YANG SEDANG LOGIN
        searchKeyword: '', // Kata kunci pencarian
        tableHeader: {
            draw: 0,
            search: '',
            length: 5,
        },
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
    },
    getters: {
        users(state) {
            return state.users
        },
        roles(state) {
            return state.roles
        },
        userRoles(state) {
            return state.userRoles
        },
        permissions(state) {
            return state.permissions
        },
        rolePermissions(state) {
            return state.role_permission
        },
        authenticatedUser(state) {
            return state.authenticated
        },
        searchKeyword(state) {
            return state.searchKeyword
        },
        tableHeader(state) {
            return state.tableHeader
        },
        // Getter untuk mengakses data paginationData
        paginationData(state) {
            return state.paginationData
        },
    },

    mutations: {
        SET_USERS(state, users) {
            state.users = users
        },
        SET_TABLE_HEADER_VALUE(state, tableHeader) {
            state.tableHeader = tableHeader
        },
        SET_ROLES(state, roles) {
            state.roles = roles
        },
        SET_USER_ROLES(state, userRoles) {
            state.userRoles = userRoles
        },
        SET_PERMISSIONS(state, permissions) {
            state.permissions = permissions
        },
        SET_ROLE_PERMISSION(state, role_permission) {
            state.role_permission = role_permission
        },
        CLEAR_ROLE_PERMISSION(state, role_permission) {
            state.role_permission = []
        },
        SET_USER_AUTH(state, authenticated) {
            state.authenticated = authenticated
        },
        SET_PAGINATION_DATA(state, paginationData) {
            state.paginationData = paginationData
        },
    },
    actions: {
        //FUNGSI UNTUK MENAMPILKAN DATA PAGING USER ROLE
        async loadUserRoles({ commit }, { url, tableHeader }) {
            try {
                const response = await axios.get(url, { params: tableHeader })
                const data = response.data.data

                // Memanggil mutation untuk mengatur data role
                commit('SET_USER_ROLES', data.data)

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
        //FUNGSI INI UNTUK MENGAMBIL DATA USER
        async getUserLists({ commit }) {
            try {
                const response = await axios.get(
                    `/role-permission/user-pegawai`
                )
                const users = response.data.data
                commit('SET_USERS', users)
                return response.data
            } catch (error) {
                console.error(error)
                throw error // Anda dapat melempar error lagi untuk penanganan di atasnya jika diperlukan.
            }
        },
        //UNTUK MENGAMBIL LIST ROLES
        async getRoles({ commit }) {
            try {
                const response = await axios.get(`/role-permission/roles`)
                const roles = response.data.data
                commit('SET_ROLES', roles)
                return response.data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        //FUNGSI UNTUK MENAMPILKAN DATA PAGING USER ROLE
        async loadRoles({ commit }, { url, tableHeader }) {
            try {
                const response = await axios.get(url, { params: tableHeader })
                const data = response.data.data

                // Memanggil mutation untuk mengatur data role
                commit('SET_ROLES', data.data)

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
        //CREATE ROLE
        async createRole({ dispatch }, roleData) {
            try {
                // Kirim data role baru ke backend
                const response = await axios.post(`/roles`, roleData)

                // Jika berhasil, panggil action fetchPermissions untuk memperbarui daftar role
                dispatch('fetchPermissions')

                // Anda juga bisa menangani respons lainnya atau memberikan notifikasi sukses
                console.log('Role berhasil dibuat:', response.data)
            } catch (error) {
                console.error('Gagal membuat role:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
        //UPDATE ROLES
        async updateRole({ commit, dispatch }, { id, roleData }) {
            try {
                const response = await axios.put(`/roles/${id}`, roleData) // Mengirim permintaan PUT
                // Perbarui daftar role setelah berhasil mengubah role
                commit('SET_ROLES', response.data.data)
                // Tampilkan notifikasi sukses atau lakukan tindakan lain yang sesuai
                console.log('Role berhasil diubah:', response.data)
            } catch (error) {
                console.error('Gagal mengubah role:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
        //HAPUS DATA ROLE
        async deleteRole({ commit, dispatch }, id) {
            try {
                const response = await axios.delete(`/roles/${id}`)
                commit('SET_ROLES', response.data.data) // Perbarui daftar roles setelah menghapus roles
                console.log('Role berhasil dihapus:', response.data)
                dispatch('fetchRoles') // Perbarui daftar roles setelah menghapus roles
            } catch (error) {
                console.error('Gagal menghapus role:', error)
                throw error
            }
        },
        //FUNGSI UNTUK MENAMPILKAN DATA PAGING PERMISSION
        async loadPermissions({ commit }, { url, tableHeader }) {
            try {
                const response = await axios.get(url, { params: tableHeader })
                const data = response.data.data

                // Memanggil mutation untuk mengatur data role
                commit('SET_PERMISSIONS', data.data)

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
        //CREATE PERMISSION
        async createPermission({ dispatch }, permissionData) {
            try {
                // Kirim data permission baru ke backend
                const response = await axios.post(
                    `/permissions`,
                    permissionData
                )
                // Anda juga bisa menangani respons lainnya atau memberikan notifikasi sukses
                console.log('Permission berhasil dibuat:', response.data)
            } catch (error) {
                console.error('Gagal membuat permission:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
        //UPDATE PERMISSION
        async updatePermission({ commit, dispatch }, { id, permissionData }) {
            try {
                const response = await axios.put(
                    `/permissions/${id}`,
                    permissionData
                ) // Mengirim permintaan PUT
                // Perbarui daftar permission setelah berhasil mengubah permission
                commit('SET_PERMISSIONS', response.data.data)
                // Tampilkan notifikasi sukses atau lakukan tindakan lain yang sesuai
                console.log('Permission berhasil diubah:', response.data)
            } catch (error) {
                console.error('Gagal mengubah permission:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
        //HAPUS DATA PERMISSION
        async deletePermission({ commit, dispatch }, id) {
            try {
                const response = await axios.delete(`/permissions/${id}`)
                commit('SET_PERMISSIONS', response.data.data) // Perbarui daftar roles setelah menghapus roles
                console.log('Pemission berhasil dihapus:', response.data)
            } catch (error) {
                console.error('Gagal menghapus permission:', error)
                throw error
            }
        },
        //UNTUK MENGAMBIL LIST ROLES
        async getPermissions({ commit }) {
            try {
                const response = await axios.get(`/role-permission/permissions`)
                const permission = response.data.data
                commit('SET_PERMISSIONS', permission)
                return response.data
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        // FUNGSI INI UNTUK MENGATUR ROLE TIAP USER
        async setRoleUser({ dispatch }, userData) {
            try {
                // Kirim data pengaturan peran pengguna ke backend
                const response = await axios.post(
                    `role-permission/set-role-user`,
                    userData
                )
                return response.data
            } catch (error) {
                console.error('Gagal mengatur peran pengguna:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },
        // FUNGSI INI UNTUK MENGATUR ROLE TIAP USER
        async updateRoleUser({ dispatch }, userData) {
            try {
                const { user_id, role } = userData // Ambil user_id dan role dari userData
                const response = await axios.post(
                    '/role-permission/set-role-user',
                    {
                        user_id,
                        role, // Kirim user_id dan role ke server
                    }
                )
                commit('SET_USER_ROLES', data.data)
                return response.data
            } catch (error) {
                console.error('Gagal mengatur peran pengguna:', error)
                throw error // Meneruskan kesalahan ke komponen pemanggil jika perlu
            }
        },

        async getRolePermissions({ commit }, payload) {
            try {
                const response = await axios.post(
                    `role-permission/get-role-permission`,
                    {
                        role_id: payload,
                    }
                )

                if (response.status === 200 && response.data) {
                    commit('SET_ROLE_PERMISSION', response.data.data)
                    return response.data
                } else {
                    throw error
                }
            } catch (error) {
                // Tangani kesalahan
                console.error(
                    'Kesalahan dalam permintaan getRolePermission:',
                    error
                )
                throw error
            }
        },
        //BERFUNGSI UNTUK MENGATUR PERMISSION SETIAP ROLEH YANG DIPILIH
        async setRolePermission({ commit }, payload) {
            try {
                const response = await axios.post(
                    `role-permission/set-role-permission`,
                    payload
                )

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
        //BERFUNGSI UNTUK UPDATE PERMISSION SETIAP ROLEH YANG DIPILIH
        async updateRolePermission({ commit }, payload) {
            try {
                const response = await axios.post(
                    `role-permission/set-role-permission`,
                    payload
                )

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
