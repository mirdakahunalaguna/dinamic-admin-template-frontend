import store from '@/store'

import Dashboard from '@/views/index.vue'

export default [
    {
        path: '/',
        component: () => import('@/layouts/AuthenticationLayout.vue'),
        children: [
            //auth route
            {
                path: '/',
                name: 'Login',
                component: () => import('@/views/auth/Login.vue'),
                beforeEnter: (to, from, next) => {
                    if (store.getters['auth/authenticated']) {
                        return next({
                            name: 'Home',
                        })
                    }
                    next()
                },
            },
            {
                path: '/auth/register',
                name: 'Register',
                component: () => import('@/views/auth/Register.vue'),
            },
            {
                path: '/auth/forgot-password',
                name: 'ForgotPassword',
                component: () => import('@/views/auth/ForgotPassword.vue'),
            },
            {
                path: '/auth/reset-password',
                name: 'ResetPassword',
                component: () => import('@/views/auth/ResetPassword.vue'),
            },
            {
                path: '/auth/confirm-password',
                name: 'ConfirmPassword',
                component: () => import('@/views/auth/ConfirmPassword.vue'),
            },
            {
                path: '/auth/verify-email',
                name: 'VerifyEmail',
                component: () => import('@/views/auth/VerifyEmail.vue'),
            },
        ],
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/DashboardLayout.vue'),
        redirect: { name: 'Dashboard' },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Dashboard,
            },
            {
                path: '/page-not-found',
                name: 'PageNotFound',
                component: () => import('@/views/PageNotFound.vue'),
            },
            {
                path: '/preventive',
                name: 'PagePreventive',
                component: () =>
                    import('@/views/operasional/PagePreventive.vue'),
            },
            {
                path: '/data-karyawan',
                name: 'PageDataKaryawan',
                component: () => import('@/views/hrd/PageDataKaryawan.vue'),
            },
            {
                path: '/page-under-developmenet',
                name: 'PageSubmenuNotFound',
                component: () => import('@/views/PageSubmenuNotFound.vue'),
            },
            {
                path: '/detail-role',
                name: 'DetailRole',
                component: () => import('@/views/pengaturan/DetailRole.vue'),
            },
            {
                path: '/detail-permission',
                name: 'DetailPermission',
                component: () =>
                    import('@/views/pengaturan/DetailPermission.vue'),
            },
            {
                path: '/setting-menu-sidebar',
                name: 'SettingMenu',
                component: () =>
                    import('@/views/pengaturan/SettingMenuSidebar.vue'),
            },
            {
                path: '/setting-submenu-sidebar',
                name: 'SettingSubmenu',
                component: () =>
                    import('@/views/pengaturan/SettingSubmenuSidebar.vue'),
            },
            {
                path: '/setting-role',
                name: 'SettingRole',
                component: () => import('@/views/pengaturan/SettingRole.vue'),
            },
        ],
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/authenticated']) {
                return next({
                    name: 'Login',
                })
            }
            next()
        },
    },
]
