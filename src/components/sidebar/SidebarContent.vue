<script setup>
import { computed, onMounted, ref } from 'vue'; 
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'; // Import useStore dari vuex
import SidebarLink from '@/components/sidebar/SidebarLink.vue'
import SidebarCollapsible from '@/components/sidebar/SidebarCollapsible.vue'
import SidebarCollapsibleItem from '@/components/sidebar/SidebarCollapsibleItem.vue'

const isCurrentRoute = (routeName) => {
    return useRouter().currentRoute.value.name == routeName
}

const store = useStore();

onMounted(async () => {
  try {
    fetchMenus()
  } catch (error) {
    console.error(error);
  }
});
const fetchMenus = async () => {
  try {
    await store.dispatch('sidebarMenu/fetchMenus');
    // Handle response di sini jika perlu
  } catch (error) {
    console.error(error);
    // Handle error di sini jika perlu
  }
};
//FUNGSI HANDLE KELUAR
const logout = () => store.dispatch('auth/logout');
// MENDAPATKAN DAFTAR MENU DARI TOKO (MENGGUNAKAN COMPUTED PROPERTY)
const menus = computed(() => store.getters['sidebarMenu/menus']);

// MENDAPATKAN DATA PENGGUNA YANG SAAT INI MASUK (MENGGUNAKAN COMPUTED PROPERTY)
const user = computed(() => store.getters['auth/user']);

// MENYIMPAN NAMA PERAN PENGGUNA
const userRoleNames = [];
if (user.value && user.value.roles && user.value.roles.length > 0) {
  // MENYIMPAN NAMA PERAN PENGGUNA DALAM ARRAY userRoleNames
  userRoleNames.push(user.value.roles[0].name);
}

// FUNGSI UNTUK MEMERIKSA APAKAH PERAN PENGGUNA SAAT INI DIIZINKAN
function IS_ROLE_ALLOWED(roles) {
  // FUNGSI INI MEMERIKSA APAKAH PERAN PENGGUNA SAAT INI DIIZINKAN BERDASARKAN PERAN YANG DIBERIKAN
  return roles.some(role => userRoleNames.includes(role.name));
}

// MENGAMBIL MENU DENGAN SUBMENU YANG DIIZINKAN BERDASARKAN PERAN PENGGUNA
const menusWithSubmenus = computed(() => {
  if (Array.isArray(menus.value)) {
    return menus.value.filter(menu => menu.submenu && menu.submenu.length > 0 && IS_ROLE_ALLOWED(menu.roles));
  }
  return [];
});

// MENGAMBIL MENU TANPA SUBMENU YANG DIIZINKAN BERDASARKAN PERAN PENGGUNA
const menusWithoutSubmenus = computed(() => {
  if (Array.isArray(menus.value)) {
    return menus.value.filter(menu => (!menu.submenu || menu.submenu.length === 0) && IS_ROLE_ALLOWED(menu.roles));
  }
  return [];
});

</script>
 
<template>
    <PerfrectScrollbar 
        tagname="nav"
        aria-label="main"
        class="relative flex flex-col flex-1 max-h-full gap-4 px-3"
    >
        <!-- Menu tanpa submenu -->
            <SidebarLink
                v-for="menu in menusWithoutSubmenus"
                 
                :key="menu.id"
                :to="{ name: menu.to }"
                :title="menu.title"
                :icon="menu.icon"
                :active="isCurrentRoute(menu.to)"
                
            />
            <!-- Menu dengan submenu -->
            <SidebarCollapsible
                v-for="menu in menusWithSubmenus"
                 
                :key="menu.id"
                :icon="menu.icon"
                :title="menu.title"
                :active="menu.submenu.some(submenu => isCurrentRoute(submenu.to))"
            >
            <SidebarCollapsibleItem
                v-for="submenu in menu.submenu"
                 
                :key="submenu.id"
                :to="{ name: submenu.to }"
                :title="submenu.title"
                :active="isCurrentRoute(submenu.to)"
            />
            </SidebarCollapsible>
            
        <SidebarCollapsible 
          icon="mdi:account-card-details" 
          title="Authentication">
            <SidebarCollapsibleItem 
                :to="{ name: 'Login' }" 
                title="Login" 
            />
            <SidebarCollapsibleItem
                :to="{ name: 'Register' }"
                title="Register"
            />
            <SidebarCollapsibleItem
                :to="{ name: 'VerifyEmail' }"
                title="Verify Email"
            />
            <SidebarCollapsibleItem
                :to="{ name: 'ForgotPassword' }"
                title="Forgot Password"
            />
            <SidebarCollapsibleItem
                :to="{ name: 'ResetPassword' }"
                title="Reset Password"
            />
            <SidebarCollapsibleItem
                :to="{ name: 'ConfirmPassword' }"
                title="Confirm Password"
            />
        </SidebarCollapsible> 
        
        <!-- Menu tanpa submenu -->
        <SidebarLink 
            @click.prevent="logout"
            title="keluar"
            icon="mdi:location-exit"
            class='bottom-2 left-2 '
        />
 
    </PerfrectScrollbar>
</template>
