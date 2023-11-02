<script setup> 
import ModalEditMenu from '@/views/modal/ModalEditMenu.vue' // Sesuaikan dengan path yang sesuai

import { Icon } from '@iconify/vue'
import { reactive, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

// Store Vuex
const store = useStore(); 
const menu = computed(() => store.getters['sidebarMenu/menu']);
const tableHeader = computed(() => store.getters['sidebarMenu/tableHeader']);
const paginationData = computed(() => store.getters['sidebarMenu/paginationData']);
const isLoading = ref(false);
const isError = ref(false); 
const isErrorMenuRole = ref(false); 
const isSuccess = ref(false);
const isSuccessMenuRole = ref(false);
const errorMessage = ref(null);
const errorMessageMenuRole = ref(null);
const successMessage = ref(null);
const successMessageMenuRole = ref(null);
const selectedRoles = ref([]);
const selectMenuOptions = ref([]); 

// const selectedRoleId = ref('');
// const selectOptions = ref([]);

// PROSES INPUT DATA 
const selectedMenuId = ref('');
const roles = ref([]);
const updateMenuRole = async () => {
  isLoading.value = true;
  try {
    console.log('selectedRoles:', selectedRoles.value); // Log nilai selectedRoles
    // Panggil fungsi setRoleUser di store Vuex Anda dengan await
    const response = await store.dispatch('sidebarMenu/setMenuRoles', {
      menu_id: selectedMenuId.value,
      roles: selectedRoles.value,
    });
    loadMenus();
    // Tindakan yang perlu dilakukan setelah permintaan berhasil.
    console.log('Izin peran diperbarui: ', response);
    isSuccessMenuRole.value = true;
    successMessageMenuRole.value = 'success asign menu to role';
    setTimeout(() => {
      isSuccessMenuRole.value = false;
    }, 3000);
  } catch (error) {
    console.error('Terjadi kesalahan saat mengatur peran menu:', error);
    isLoading.value = false;
    isErrorMenuRole.value = true;
    errorMessageMenuRole.value = 'error asign role to user';
    setTimeout(() => {
      isErrorMenuRole.value = false;
    }, 3000);
  }
};

//MENGATUR ITEM SELECT ROLE
const fetchRoles = async () => {
  try {
    await store.dispatch('user/getRoles');
    roles.value = store.state.user.roles;
    // console.log(roles.value)
  } catch (error) {
    console.error(error);
  }
}; 
//TAMPILKAN ROLE SESUAI MENU TERPILIH
const showMenus = async () => {
  isLoading.value = true;
  try {
    const menu_id = selectedMenuId.value;
    const response = await store.dispatch('sidebarMenu/getMenuRoles', menu_id);

    if (response.data) {
      selectedRoles.value = response.data.map(role => role.id);
      console.log(selectedRoles.value);

      if (selectedRoles.value.length === 0) {
        isLoading.value = false;
        isErrorMenuRole.value = true;
        errorMessageMenuRole.value = 'Role empty data'
        setTimeout(() => {
          isErrorMenuRole.value = false;
        }, 3000);
      }
    } else {
      console.error('Data roles tidak ditemukan.');
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
  } finally {
    isLoading.value = false;
  }
};

//MENGATUR SELECTED MENUS
const selectMenus = async () => {
  try {
    // Panggil aksi fetchMenus dari store Anda
    await store.dispatch('sidebarMenu/fetchMenus'); 
    // Ambil data menu dari store setelah diambil dari API
    const menus = store.state.sidebarMenu.menus; // Sesuaikan dengan nama modul dan state Anda
    // Pastikan menu tidak kosong dan memiliki data yang valid sebelum memanggil map
    if (Array.isArray(menus) && menus.length > 0) { // Ganti 'menu' menjadi 'menus'
      // Ubah data menu menjadi format yang sesuai dengan format selectMenuOptions
      const formattedMenus = menus.map(menu => ({ // Ganti 'menu' menjadi 'menus'
        value: menu.id, // Sesuaikan dengan nilai yang ingin Anda gunakan
        label: menu.title, // Sesuaikan dengan label yang ingin Anda gunakan
      }));
      // Tambahkan placeholder "Pilih menu" yang tidak dapat dipilih
      formattedMenus.unshift({ value: '', label: 'Pilih menu', disabled: true });
      // Isi selectMenuOptions dengan data yang diambil dari API
      selectMenuOptions.value = formattedMenus;
       // Set selectedMenuId ke nilai pertama (atau nilai yang sesuai) jika Anda ingin memilihnya secara default
      selectedMenuId.value = formattedMenus[0].value;
    } else {
      console.error('Data menu kosong atau tidak valid.');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data menu:', error);
  }
} 
// PROSES INPUT DATA MENU
const menuData = reactive({//inisiasi nilai awal variable
  menuName: '',
  routeName: '',
  iconName: '',
}); 
//PROSES INSERT DATA MENU
const createNewMenu = async () => {//akses fungsi vuex terkait iput data
  try {
    isLoading.value = true;
    isError.value = false; // Reset isError

    // Menyiapkan data untuk dikirim ke action createMenu
    const menuDataToSend = {
      title: menuData.menuName,
      to: menuData.routeName,
      icon: menuData.iconName,
    };
    
    // Menggunakan action createMenu dari Vuex untuk membuat menu baru
    await store.dispatch('sidebarMenu/createMenu', menuDataToSend);
    loadMenus(); // Muat ulang menu setelah menghapus
    // Setelah menambahkan menu, Anda bisa membersihkan form atau memberikan notifikasi sukses.
    isLoading.value = false;
    menuData.menuName = '';
    menuData.routeName = '';
    menuData.iconName = '';
    isSuccess.value = true;
    successMessage.value = 'succes create new menu'
    setTimeout(() => {
      isSuccess.value = false;
    }, 3000);
    // Atau bisa melakukan navigasi ke halaman lain jika diperlukan.
    // Misalnya, dengan menggunakan router.push untuk pergi ke halaman lain.
  } catch (error) {
    console.error('Terjadi kesalahan saat menambahkan menu:', error);
    isLoading.value = false;
    isError.value = true;
    errorMessage.value = 'An error occurred while adding the menu. Please try again later.'; // Set errorMessage
    setTimeout(() => {
      isError.value = false;
    }, 3000);
  }
};

// PROSES DELETE MENU
const deleteId = ref(null); // Default value is null
const itemName = ref(null); // Default value is null
// Buat ref untuk mengontrol kapan modal harus ditampilkan
const isDeleteModalOpen = ref(false);

// Persiapan sebelum menghapus menu
const prepareDelete = (id, title) => {
  // Set ID menu yang akan dihapus
  deleteId.value = id;
  itemName.value = title;
  // Buka modal
  isDeleteModalOpen.value = true;
}; 
// Fungsi untuk menghapus menu
const deleteMenu = async () => {
  try {
    isLoading.value = true;
    // Panggil aksi deleteMenu dari Vuex dengan ID menu yang akan dihapus
    await store.dispatch('sidebarMenu/deleteMenu', deleteId.value);
    isLoading.value = false;
    isDeleteModalOpen.value = false;
    loadMenus(); // Muat ulang menu setelah menghapus
  } catch (error) {
    console.error('Gagal menghapus menu:', error);
  }
};

// PROSES UPDATE MENU
const isEditModalOpen = ref(false);
const editedMenu = ref({ title: '', to: '', icon: '',role:'' });

// Fungsi untuk membuka modal edit menu
const openModalEditMenu = (menu) => {
  // Buka modal edit dan isi data menu yang akan diubah
  editedMenu.value = { ...menu, id: menu.id };
  isEditModalOpen.value = true;
};
// Fungsi untuk mengupdate menu
const updateMenu = async (updatedMenu) => {
  try {
    isLoading.value = true;
    // Panggil action updateMenu dari Vuex dengan data yang akan diubah
    await store.dispatch('sidebarMenu/updateMenu', { id: editedMenu.value.id, menuData: updatedMenu });
    isLoading.value = false;
    isEditModalOpen.value = false; // Tutup modal setelah pengeditan selesai
    loadMenus(); // Muat ulang menu setelah mengubah
  } catch (error) {
    console.error('Terjadi kesalahan saat mengubah menu:', error);
    isLoading.value = false;
    // Handle error, misalnya dengan menampilkan pesan kesalahan kepada pengguna
  }
};

// PROSES SORTING/PENGURUTAN DATA
let tableColumns = ref([
  // Definisikan kolom-kolom tabel
  { indexOf: 0, name: 'icon', label: 'icon' },
  { indexOf: 1, name: 'title', label: 'title', sortable: true },
  { indexOf: 2, name: 'to', label: 'route to', sortable: true },
  { indexOf: 2, name: 'role', label: 'role' },
  { indexOf: 3, name: 'action', label: 'action' },
]);
// Inisialisasi penentuan kolom yang bisa disorting/ tampil ikon sorting.
const sortKey = ref(['title', 'to']);
// Inisialisasi sortOrders dengan urutan pengurutan awal untuk setiap kolom.
const sortOrders = ref({});
// Inisialisasi kolom terpilih yang di sorting.
const selectedKey = ref([]); 
// Fungsi untuk mengganti urutan pengurutan
const toggleSortOrder = (columnName) => {
  console.log(columnName)
  if (selectedKey.includes(columnName)) {
    const index = selectedKey.indexOf(columnName);
    selectedKey.splice(index, 1);
  } else {
    selectedKey.push(columnName);
  }
  // Reset urutan pengurutan untuk kolom yang diubah
  sortOrders[columnName] = sortOrders[columnName] === 'asc' ? 'desc' : 'asc';
}; 
const sortedMenus = computed(() => {
  const sortedMenus = [...menu.value]; 
  sortedMenus.sort((a, b) => {
    for (const columnName of selectedKey.value) {
      const keyA = a[columnName] ? a[columnName].toLowerCase() : '';
      const keyB = b[columnName] ? b[columnName].toLowerCase() : '';

      if (keyA < keyB) {
        return sortOrders[columnName] === 'asc' ? -1 : 1;
      } else if (keyA > keyB) {
        return sortOrders[columnName] === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  return sortedMenus;
});

// PROSES SETTING TABLE DATA
const showElement = reactive({
  showSearch: true,
  showTotalDisplay: true,
});

// Fungsi untuk memanggil loadMenus dengan paginationData yang sesuai
const loadMenus = (url = '/menu/show') => {
  try {
    isLoading.value = true;
    // Panggil store.dispatch dengan tableHeader yang telah diperbarui
    store.dispatch('sidebarMenu/loadMenus', { url, tableHeader: tableHeader.value });
    
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
}; 
onMounted(() => {
  loadMenus();
  fetchRoles();
  selectMenus(); 
});
</script>


<template>
  <PageWrapper title="Create Menu Sidebar">
    <!--  --> 
    <template v-if="isLoading"> 
      <loading-screen/> 
    </template>     
    <!-- komponen modal delete -->
    <modal-delete
      :is-open="isDeleteModalOpen"
      :deleteId="deleteId"
      :itemName="itemName"
      @close="isDeleteModalOpen = false"
      @confirm-delete="deleteMenu" 
      v-if="isDeleteModalOpen"/>
  <!-- Gunakan komponen EditMenuModal -->
    <modal-edit-menu
      :is-open="isEditModalOpen" 
      :editedMenu="editedMenu" 
      @update-menu="updateMenu" 
      @close="isEditModalOpen = false" />

  <div class="-mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
    <div class="grid grid-cols-1 gap-4 ">
      <BaseCard  title="input menu" >
        <div  class="w-full h-10 flex items-center justify-start ">
          <InputError v-if="isError" :message="errorMessage" />
          <InputSuccess v-if="isSuccess" :message="successMessage" />
        </div> 
        <form class="grid grid-cols-1 gap-4 md:w-3/4">
          <InputCustome
            id="menu-name"
            label="Menu Name"
            v-model="menuData.menuName"
          />
              
          <div class="place-items-stretch flex gap-4" >
            <InputCustome
              id="icon-name"
              label="Icon Name"
              v-model="menuData.iconName"  
              class="w-4/5"
            />   
            <a
              href="https://icon-sets.iconify.design/" 
              class="bg-slate-200 dark:bg-slate-800 font-semibold border-2 dark:border-slate-600 rounded-md w-1/5 flex items-center justify-center"
              target="_blank" 
              rel="noopener noreferrer"
              ><span class="text-rose-600">* </span>cari
              </a> 
            </div> 
          
          <InputCustome
            hidden
            id="route-name"
            label="Route Name"
            v-model="menuData.routeName"
            disabled class="border-b-2 border-gray-400"
            /> 
          <Button  
              icon-only
              type="button"
              class="w-10 mt-2"
              variant="secondary"
              srText="Toggle dark mode"
              left-icon="icon-park-solid:add"
              @click="createNewMenu" >
          </Button> 
        </form>        
      </BaseCard> 
      <div>
        <BaseCard  title="assign menu to role" >
          <div  class="w-full h-10 -mt-2 flex items-center justify-start ">
            <InputError v-if="isErrorMenuRole" :message="errorMessageMenuRole" />
            <InputSuccess v-if="isSuccessMenuRole" :message="successMessageMenuRole" />
          </div> 
          <form class="grid grid-cols-1 gap-4">  
            <div class="flex gap-6">
              <input-select
                      id="menu-name"
                      :options="selectMenuOptions" 
                      v-model="selectedMenuId" 
                      class="md:w-2/4"
                    />
              <div>
                <Button  
                  type="button"
                  class="justify-center"
                  variant="secondary"
                  srText="Toggle dark mode"
                  left-icon="pajamas:check-sm"
                  @click="showMenus"
                >
                  <span>Check</span>
                </Button>                
              </div>
            </div>     
            <base-card>
              <div class="grid grid-cols-2 gap-4">
                 <label
                  v-for="role in roles"
                  :key="role.id"
                  class="flex items-center gap-4"
                  >
                  <input-checkbox
                    :key="role.id"
                    :value="role.id"
                    v-model="selectedRoles"
                  />
                  {{ role.name }}
                </label>
              </div> 
            </base-card>
            <div>
              <Button  
                  icon-only
                  type="button" 
                  variant="secondary"
                  srText="Toggle dark mode"
                  left-icon="eos-icons:role-binding"
                  @click="updateMenuRole"
              ><span>Set Role</span> 
              </Button>
            </div> 
          </form>        
        </BaseCard> 
      </div>
    </div> 
    <div>
      <base-card title="tabel menu" >  
        <TableSetting
        :element="showElement"
        v-model:search="tableHeader.search"
        v-model:length="tableHeader.length"
        @searchValueEnter="loadMenus()"
        @searchValueButtonClick="loadMenus()"
        @showTotalDisplayChanged="loadMenus()"
        /> 
        <TableHeaders
          :columns="tableColumns"
          :sort-key="sortKey"
          :sort-orders="sortOrders"
          :show-icons="true"
          :selected-key="selectedKey"
          @sort="toggleSortOrder"
          class="mt-4"
        >
          <tbody >
            <tr v-for="menu in sortedMenus"  
            @click="toggleSortOrder(column.name)" 
            :key="menu.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-3"><Icon class="w-6 h-6" :icon="menu.icon" /> </td>
            <td class="px-6 py-3 ">{{ menu.title }} </td>
            <td class="px-6 py-3">{{ menu.to }}</td>
            <td class="px-6 py-3">
              <span v-for="(role, index) in menu.roles" :key="index" class="flex gap-1">
                <!-- Tambahkan tanda "-" di awal setiap elemen -->
                <span> - </span>
                <span>{{ role.name }}</span>
                <!-- Buat baris baru setiap element -->
                <br v-if="index < menu.roles.length - 1">
              </span>
            </td>
            <td class="px-6 py-3">
              <Dropdown align="right" class="">
                <template #trigger>
                  <Button
                    iconOnly
                    variant="secondary"
                    icon="mdi:dots-horizontal"
                  ></Button>
                </template>
                <template #content>
                  <div class="flex flex-col">
                    <button @click.prevent="openModalEditMenu(menu)">
                      <DropdownLink to="#">edit</DropdownLink>
                    </button>
                    <button
                      @click.prevent="prepareDelete(menu.id, menu.title)"
                      :disabled="!menu.id"
                    >
                      <DropdownLink to="#">delete</DropdownLink>
                    </button>
                  </div>
                </template>
              </Dropdown>
            </td>
            </tr>
          </tbody> 
        </TableHeaders>
      </base-card>
      <TablePagination
        :pagination="paginationData"
        @prevPage="loadMenus(paginationData.prevPageUrl)"
        @nextPage="loadMenus(paginationData.nextPageUrl)"
      />
    </div>
  </div>
  </PageWrapper>
</template>
