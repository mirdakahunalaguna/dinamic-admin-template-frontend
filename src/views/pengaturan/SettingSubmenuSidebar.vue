<template>
  <PageWrapper title="Create Submenu Sidebar">
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
        @confirm-delete="deleteSubmenu" 
        v-if="isDeleteModalOpen"/>
    <!-- Gunakan komponen ModalEditSubmenu -->
      <modal-edit-submenu
        :is-open="isEditModalOpen" 
        :editedSubmenu="editedSubmenu" 
        :selectOptions="selectOptions"
        @update-submenu="updateSubmenu" 
        @close="isEditModalOpen = false" />
      
    <div class="-mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <BaseCard 
        title="input sub-menu" 
        :actions="[{ title: 'View', to: '#' }]">
          <div  class="w-full h-10 -mt-2 flex items-center justify-start">
            <InputError v-if="isError" :message="errorMessage" />
            <InputSuccess v-if="isSuccess" :message="successMessage" />
          </div> 
          <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-6 md:w-3/4">
            <input-select
                  id="menu-name"
                  :options="selectOptions" 
                  v-model="selectedMenuId"
                />
                <!-- <p>Anda telah memilih menu dengan ID: {{ selectedMenuId }}</p> -->
            <InputLabelWrapper label="title" >
            <Input
              withLabel
              type="text"
              class=" pl-24"
              v-model="form.title" 
            />
            </InputLabelWrapper>
            <InputLabelWrapper label="route to " >
            <Input
              withLabel
              type="text"
              class="block w-full  pl-24"
              v-model="form.to"
            />
            </InputLabelWrapper> 
            <Button  
                icon-only
                type="submit"
                class="w-10"
                variant="secondary"
                srText="Toggle dark mode"
                left-icon="icon-park-solid:add"
            >
            </Button>
          </form>  
        </BaseCard>
      </div>
      <div>
        <base-card title="tabel sub-menu">
          <TableSetting
            :element="showElement"
            v-model:search="tableHeader.search"
            v-model:length="tableHeader.length"
            @searchValueEnter="loadSubmenus()"
            @searchValueButtonClick="loadSubmenus()"
            @showTotalDisplayChanged="loadSubmenus()"
            />
          <TableHeaders
            :columns="tableColumns"
            :sort-key="sortKey"
            :sort-orders="sortOrders"
            :show-icons="true"
            :selected-key="selectedKey"
            @sort="toggleSortOrder"
            class="mt-6 max-h-screen"
          >
            <tbody >
              <tr v-for="submenu in sortedSubmenus"  
                @click="toggleSortOrder(column.name)" 
                :key="submenu.id" 
                class=" bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-3">{{ submenu.menu.title }}</td>
                <td class="px-6 py-3">{{ submenu.title }} </td>
                <td class="px-6 py-3">{{ submenu.to }}</td>
                <td class="px-6 py-3">
                  <Dropdown align="right" >
                    <template #trigger>
                      <Button
                        sr-text="Actions"
                        size="sm"
                        icon-only
                        icon="mdi:dots-vertical"
                        variant="secondary"
                      />
                    </template>
                    <template #content>
                      <div class="flex flex-col">
                        <button @click.prevent="openModalEditSubmenu(submenu)">
                          <DropdownLink to="#">edit</DropdownLink>
                        </button>
                        <button
                          @click.prevent="prepareDelete(submenu.id, submenu.title)"
                          :disabled="!submenu.id"
                        >
                          <DropdownLink to="#">delete</DropdownLink>
                        </button>
                      </div>
                    </template>
                  </Dropdown>
                </td> 
              </tr>
              <tr class="h-20"></tr>
            </tbody> 
          </TableHeaders>
        </base-card>
        <TablePagination
          :pagination="paginationData"
          @prevPage="loadSubmenus(paginationData.prevPageUrl)"
          @nextPage="loadSubmenus(paginationData.nextPageUrl)"
        />
      </div>
    </div>
  </PageWrapper>
</template>
<script setup>
import ModalEditSubmenu from '@/views/modal/ModalEditSubmenu.vue'
import { ref, onMounted, computed, reactive } from 'vue';
import { useStore } from 'vuex';

// State untuk loading dan error handling
const isLoading = ref(false);
const isError = ref(false);
const isSuccess = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const selectedMenuId = ref(''); 
const selectOptions = ref([]);
const store = useStore();
// Membuat sebuah pemantauan data untuk menu yang benar-benar merespons perubahan di Vuex.
const submenu = computed(() => store.getters['sidebarSubmenu/submenu']);

// Membuat sebuah pemantauan data untuk tableHeader yang merespons perubahan di Vuex.
const tableHeader = computed(() => store.getters['sidebarMenu/tableHeader']);
// Membuat sebuah pemantauan data untuk paginationData yang merespons perubahan di Vuex.
const paginationData = computed(() => store.getters['sidebarSubmenu/paginationData']);

//PROSES MEMBUAT INPUT SELECT DATA MENU
const listMenu = async () => {
  try {
    // Panggil aksi listMenu dari store Anda
    await store.dispatch('sidebarMenu/fetchMenus');

    // Ambil data menu dari store setelah diambil dari API
    const menus = store.state.sidebarMenu.menus; // Sesuaikan dengan nama modul dan state Anda

    // Pastikan menu tidak kosong dan memiliki data yang valid sebelum memanggil map
    if (Array.isArray(menus) && menus.length > 0) { // Ganti 'menu' menjadi 'menus'
      // Ubah data menu menjadi format yang sesuai dengan format selectOptions
      const formattedMenus = menus.map(menu => ({ // Ganti 'menu' menjadi 'menus'
        value: menu.id, // Sesuaikan dengan nilai yang ingin Anda gunakan
        label: menu.title, // Sesuaikan dengan label yang ingin Anda gunakan
      }));
      // Tambahkan placeholder "Pilih menu" yang tidak dapat dipilih
      formattedMenus.unshift({ value: '', label: 'Pilih menu', disabled: true });
      // Isi selectOptions dengan data yang diambil dari API
      selectOptions.value = formattedMenus;

      // Set selectedMenuId ke nilai pertama (atau nilai yang sesuai) jika Anda ingin memilihnya secara default
      selectedMenuId.value = formattedMenus[0].value;
    } else {
      console.error('Data menu kosong atau tidak valid.');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data menu:', error);
  }
}
//PROSES TAMPIL DATA SUBMENU   
const listSubmenu = async () => {
  try {
    await store.dispatch('sidebarSubmenu/fetchSubmenus'); 
    
  } catch (error) {
    console.error(error);
  }
};
//PROSES INPUT DATA
const form = reactive({
  title: '',
  to: '',
})
const handleSubmit = async () => {
  try {
    isLoading.value = true;
    isError.value = false; // Reset isError
    // Persiapkan data submenu yang akan dikirim
    const submenuData = {
      menu_id: selectedMenuId.value,
      title: form.title,
      to: form.to,
      // ...Tambahkan data lainnya sesuai kebutuhan
    };
    // Menggunakan action createMenu dari Vuex untuk membuat menu baru
    await store.dispatch('sidebarSubmenu/createSubmenu', submenuData);
    listMenu();
    loadSubmenus();
    listSubmenu();
    // After adding the submenu successfully, reset the form
    isSuccess.value = true;
    successMessage.value = 'succes create new sub menu'
    setTimeout(() => {
      isSuccess.value = false;
    }, 3000);
    isLoading.value = false;
    form.title = null;
    form.to = null;
    selectedMenuId.value = selectOptions.value[0].value; // Reset the selectedMenuId
    // Lakukan operasi lain jika diperlukan, misalnya menavigasi atau membersihkan formulir
    // console.log('Submenu yang baru dibuat:', submenuData);
  } catch (error) {
    console.error('Terjadi kesalahan saat membuat submenu:', error);
    isLoading.value = false;
    isError.value = true;
    errorMessage.value = 'An error occurred while adding the menu. Please try again later.'; // Set errorMessage
    setTimeout(() => {
      isError.value = false;
    }, 3000);
  }
}

// PROSES SORTING/PENGURUTAN DATA
let tableColumns = ref([
  // Definisikan kolom-kolom tabel
  { indexOf: 0, name: 'menu_id', label: 'menu', sortable: true },
  { indexOf: 1, name: 'title', label: 'sub-menu', sortable: true },
  { indexOf: 2, name: 'to', label: 'to', sortable: true },
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
  if (selectedKey.includes(columnName)) {
    const index = selectedKey.indexOf(columnName);
    selectedKey.splice(index, 1);
  } else {
    selectedKey.push(columnName);
  }
  // Reset urutan pengurutan untuk kolom yang diubah
  sortOrders[columnName] = sortOrders[columnName] === 'asc' ? 'desc' : 'asc';
};

const sortedSubmenus = computed(() => {
  const sortedSubmenus = [...submenu.value];
  sortedSubmenus.sort((a, b) => {
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

  return sortedSubmenus;
});

// PROSES SETTING TABLE DATA
const showElement = reactive({
  showSearch: true,
  showTotalDisplay: true,
});

// Fungsi untuk memanggil loadMenus dengan paginationData yang sesuai
const loadSubmenus = (url = '/submenu/show') => {
  try {
    isLoading.value = true;
    // Panggil store.dispatch dengan tableHeader yang telah diperbarui
    store.dispatch('sidebarSubmenu/loadSubmenus', { url, tableHeader: tableHeader.value });
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
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
  deleteId.value = id;// Tambahkan console.log di sini\
  itemName.value = title;
  // Buka modal
  isDeleteModalOpen.value = true;
};

// Fungsi untuk menghapus menu
const deleteSubmenu = async () => {
  try {
    isLoading.value = true;
    // Panggil aksi deleteSubmenu dari Vuex dengan ID menu yang akan dihapus
    await store.dispatch('sidebarSubmenu/deleteSubmenu', deleteId.value);
    isLoading.value = false;
    isDeleteModalOpen.value = false;
    listMenu();
    loadSubmenus();
    listSubmenu();
  } catch (error) {
    console.error('Gagal menghapus submenu:', error);
  }
};

// PROSES UPDATE SUBMENU
const isEditModalOpen = ref(false);
const editedSubmenu = ref({
  menu_id: '',
  title: '',
  to: ''
});


// Fungsi untuk membuka modal edit menu
const openModalEditSubmenu = (submenu) => {
  // Buka modal edit dan isi data submenu yang akan diubah
  editedSubmenu.value = { ...submenu }; // Perhatikan perubahan di sini
  console.log(editedSubmenu.value)
  isEditModalOpen.value = true;
};

// Fungsi untuk mengupdate menu
const updateSubmenu = async (updatedSubmenu) => {
  try {
    isLoading.value = true;
    // Panggil action update submenu dari Vuex dengan data yang akan diubah
    await store.dispatch('sidebarSubmenu/updateSubmenu', { id: editedSubmenu.value.id, submenuData: updatedSubmenu });
    isLoading.value = false;
    isEditModalOpen.value = false; // Tutup modal setelah pengeditan selesai
    listMenu();
    loadSubmenus();
    listSubmenu();
  } catch (error) {
    console.error('Terjadi kesalahan saat mengubah submenu:', error);
    isLoading.value = false;
    // Handle error, misalnya dengan menampilkan pesan kesalahan kepada pengguna
  }
};
onMounted(async () => {
  // Panggil fungsi listMenu setelah komponen di-mount
  listMenu();  
  listSubmenu();
  loadSubmenus();
});
</script>