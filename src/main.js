import { createApp } from 'vue'
import App from '@/App.vue'
import '@/assets/css/main.css'
import '@/store/subscriber'
import { Icon } from '@iconify/vue'
import PerfrectScrollbar from '@/components/PerfectScrollbar.vue'
import TableSetting from '@/components/table/TableSetting.vue'
import TableHeaders from '@/components/table/TableHeaders.vue'
import TablePagination from '@/components/table/TablePagination.vue'
import Input from '@/components/input/Input.vue'
import InputError from '@/components/input/InputError.vue'
import InputSuccess from '@/components/input/InputSuccess.vue'
import InputCustome from '@/components/input/InputCustome.vue'
import InputSelect from '@/components/input/InputSelect.vue'
import InputCheckbox from '@/components/input/InputCheckbox.vue'
import InputIconWrapper from '@/components/input/InputIconWrapper.vue'
import InputLabelWrapper from '@/components/input/InputLabelWrapper.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownLink from '@/components/dropdown/DropdownLink.vue'
import PageWrapper from '@/components/PageWrapper.vue'
import BaseCard from '@/components/card/BaseCard.vue'
import Button from '@/components/Button.vue'
import Checkbox from '@/components/Checkbox.vue'
import Label from '@/components/Label.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import ModalDelete from '@/views/modal/ModalDelete.vue'
import Toast from 'vue-toastification'
import router from '@/router'
import Store from '@/store'

import axios from 'axios'
window.axios = axios
axios.defaults.baseURL = 'http://localhost:8000/api'

Store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
    const app = createApp(App)
    app.use(Store)
    app.use(router)
    app.use(Toast, {
        hideProgressBar: true,
        closeOnClick: false,
        closeButton: false,
        icon: false,
        timeout: false,
        transition: 'Vue-Toastification__fade',
    })
    app.component('TableSetting', TableSetting)
    app.component('TableHeaders', TableHeaders)
    app.component('TablePagination', TablePagination)
    app.component('PageWrapper', PageWrapper)
    app.component('BaseCard', BaseCard)
    app.component('Button', Button)
    app.component('Label', Label)
    app.component('LoadingScreen', LoadingScreen)
    app.component('Input', Input)
    app.component('InputError', InputError)
    app.component('InputSuccess', InputSuccess)
    app.component('InputCustome', InputCustome)
    app.component('InputSelect', InputSelect)
    app.component('InputCheckbox', InputCheckbox)
    app.component('InputIconWrapper', InputIconWrapper)
    app.component('InputLabelWrapper', InputLabelWrapper)
    app.component('Dropdown', Dropdown)
    app.component('DropdownLink', DropdownLink)
    app.component('Checkbox', Checkbox)
    app.component('ModalDelete', ModalDelete)
    app.component('PerfrectScrollbar', PerfrectScrollbar)
    // Menggunakan komponen Icon dari Iconify
    app.component('Icon', Icon)
    app.mount('#app')
})
