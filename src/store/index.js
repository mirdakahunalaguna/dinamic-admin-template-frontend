import { createStore } from 'vuex'
import auth from '@/store/auth'
import sidebarMenu from '@/store/sidebarMenu'
import sidebarSubmenu from '@/store/sidebarSubmenu'
import user from '@/store/user'
// import user from '@/store/state/user'
// import absensi from '@/store/state/absensi'
// import pegawai from '@/store/state/pegawai'

const store = createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        auth,
        sidebarMenu,
        sidebarSubmenu,
        user,
        // absensi,
        // pegawai,
    },
})
export default store
