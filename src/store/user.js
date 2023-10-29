import axios from 'axios'

export default {
    namespaced: true,
    state: {
        users: [], //MENAMPUNG LIST USER
        roles: [], //MENAMPUNG LIST ROLES
        permissions: [], //MENAMPUNG LIST PERMISSION
        role_permission: [], //MENAMPUNG PERMISSION YANG DIMILIKI OLEH ROLE
        authenticated: [], //MENAMPUNG USER YANG SEDANG LOGIN
        searchKeyword: '', // Kata kunci pencarian
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users
        },
        SET_ROLES(state, roles) {
            state.roles = roles
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
    },
    actions: {
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
        //FUNGSI INI UNTUK MENGATUR ROLE TIAP USER
        async setRoleUser({ dispatch }, userData) {
            try {
                // Kirim data pengaturan peran pengguna ke backend
                const response = await axios.post(
                    `role-permission/set-role-user`,
                    userData
                )

                // Anda juga bisa menangani respons lainnya atau memberikan notifikasi sukses
                console.log(
                    'Pengaturan peran pengguna berhasil:'
                    // response.data.data
                )
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
    },
}
