<template>
  <page-wrapper title="handling data role"> 
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
        @confirm-delete="deleteRole" 
        v-if="isDeleteModalOpen"/>
    <!-- Gunakan komponen EditModal -->
      <modal-edit-role
        :is-open="isEditModalOpen" 
        :editedRole="editedRole" 
        @update-role="updateRole" 
        @close="isEditModalOpen = false" />


      <div class="-mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"> 
        <div>
          <BaseCard 
          title="create role"
          :actions="[{ title: 'back', to: 'setting-role' }]" >
            <div  class="w-full h-10 -mt-2 flex items-center justify-start ">
              <InputError v-if="isError" :message="errorMessage" />
              <InputSuccess v-if="isSuccess" :message="successMessage" />
            </div> 
            <form @submit.prevent="createRole" class="grid grid-cols-1 gap-6 md:w-3/4">
              <InputLabelWrapper label="role name" >
                <Input
                  withLabel
                  type="text"
                  class="pl-32"
                  v-model="roleName"
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
          <base-card title="table role">
            <TableSetting
              :element="showElement" 
              v-model:search="tableHeader.search"
              v-model:length="tableHeader.length"
              @searchValueEnter="loadRoles()"
              @searchValueButtonClick="loadRoles()"
              @showTotalDisplayChanged="loadRoles()"
              @keyup.enter="loadRoles()"
              @keydown.tab="loadRoles()"
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
                <tr v-for="(roles, index) in sortedRoles"  
                @click="toggleSortOrder(column.name)" 
                :key="roles.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="pl-6 py-3 w-16">{{ index + 1 }}</td> 
                <td class="pl-6 py-3 ">{{ roles.name }} </td> 
                <td class="px-6 py-3 w-20">
                  <Dropdown align="right" class="">
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
                        <button @click.prevent="openModalEditRole(roles)">
                          <DropdownLink to="#">edit role</DropdownLink>
                        </button>
                        <button @click.prevent="prepareDelete(roles.id, roles.name)"
                          :disabled="!roles.id">
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
            @prevPage="loadRoles(paginationData.prevPageUrl)"
            @nextPage="loadRoles(paginationData.nextPageUrl)"
          />
        </div>
      </div>
  </page-wrapper>
</template>
<script setup>
import ModalEditRole from '@/views/modal/ModalEditRole.vue'


import { ref, onMounted, computed, reactive } from 'vue';
import { useStore } from 'vuex';

const isLoading = ref(false);
const isSuccess = ref(false);
const successMessage = ref(null);
const isError = ref(false);
const errorMessage = ref(null);
 
const store = useStore();
const tableHeader = computed(() => store.getters['user/tableHeader']);
const paginationData = computed(() => store.getters['user/paginationData']);
const roles = computed(() => store.getters['user/roles']);

//PROSES CREATE DATA ROLE
const roleName = ref(null);
const createRole = async () => {
  try {
    isLoading.value = true;
    isError.value = false; // Reset isError
    // Persiapkan data role yang akan dikirim
    const roleData = {
      name :roleName.value,
      // ...Tambahkan data lainnya sesuai kebutuhan
    };
    // Menggunakan action createMenu dari Vuex untuk membuat menu baru
    await store.dispatch('user/createRole', roleData);
    loadRoles();
    // After adding the role successfully, reset the form
    isSuccess.value = true;
    successMessage.value = 'succes create new role'
    setTimeout(() => {
      isSuccess.value = false;
    }, 3000);
    isLoading.value = false;
    roleName.value = null;
  } catch (error) {
    console.error('Terjadi kesalahan saat membuat role:', error);
    isLoading.value = false;
    isError.value = true;
    errorMessage.value = 'An error occurred while adding the menu. Please try again.'; // Set errorMessage
    setTimeout(() => {
      isError.value = false;
    }, 3000);
  }
}
// PROSES DELETE MENU
const deleteId = ref(null); // Default value is null
const itemName = ref(null); // Default value is null
// Buat ref untuk mengontrol kapan modal harus ditampilkan
const isDeleteModalOpen = ref(false);

// Persiapan sebelum menghapus menu
const prepareDelete = (id, name) => {
  // Set ID menu yang akan dihapus
  deleteId.value = id;
  itemName.value = name;
  // Buka modal
  isDeleteModalOpen.value = true;
};
// Fungsi untuk menghapus menu
const deleteRole = async () => {
  try {
    isLoading.value = true;
    // Panggil aksi deleteRole dari Vuex dengan ID menu yang akan dihapus
    await store.dispatch('user/deleteRole', deleteId.value);
    isLoading.value = false;
    isDeleteModalOpen.value = false;
     loadRoles();
  } catch (error) {
    console.error('Gagal menghapus menu:', error);
  }
};



// PROSES UPDATE ROLE
const isEditModalOpen = ref(false);
const editedRole = ref({ name:'' });

// Fungsi untuk membuka modal edit role
const openModalEditRole = (roles) => {
  // Buka modal edit dan isi data role yang akan diubah
  editedRole.value = { ...roles, id: roles.id };
  isEditModalOpen.value = true;
};
// Fungsi untuk mengupdate menu
const updateRole = async (updatedRole) => {
  try {
    isLoading.value = true;
    // Panggil action update dari Vuex dengan data yang akan diubah
    await store.dispatch('user/updateRole', { id: editedRole.value.id, roleData: updatedRole });
    isLoading.value = false;
    isEditModalOpen.value = false; // Tutup modal setelah pengeditan selesai
    loadRoles(); // Muat ulang menu setelah mengubah
  } catch (error) {
    console.error('Terjadi kesalahan saat mengubah role', error);
    isLoading.value = false;
    // Handle error, misalnya dengan menampilkan pesan kesalahan kepada pengguna
  }
};

// PROSES SETTING TABLE DATA
const showElement = reactive({
  showSearch: true,
  showTotalDisplay: true,
});
const loadRoles = (url = '/roles') => {
  try {
    isLoading.value = true;
    // Panggil store.dispatch dengan tableHeader yang telah diperbarui
    store.dispatch('user/loadRoles', { url, tableHeader: tableHeader.value });

    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};
// PROSES SORTING/PENGURUTAN DATA
let tableColumns = ref([
  { indexOf: 0, name: 'no', label: 'no',  width:'5%'},
  { indexOf: 1, name: 'name', label: 'name', sortable: true },
  { indexOf: 2, name: 'action', label: 'action' },
]);
// Inisialisasi penentuan kolom yang bisa disorting/ tampil ikon sorting.
const sortKey = ref(['name']);
// Inisialisasi sortOrders dengan urutan pengurutan awal untuk setiap kolom.
const sortOrders = ref({});
// Inisialisasi kolom terpilih yang di sorting.
const selectedKey = ref([]);
// Fungsi untuk mengganti urutan pengurutan
const toggleSortOrder = (columnName) => {
  if (selectedKey.includes(columnName)) {
    const index = selectedKey.indexOf(columnName);
    selectedKey.splice(index, 0);
  } else {
    selectedKey.push(columnName);
  }
  // Reset urutan pengurutan untuk kolom yang diubah
  sortOrders[columnName] = sortOrders[columnName] === 'asc' ? 'desc' : 'asc';
};
const sortedRoles = computed(() => {
  // Check if roles.value is defined and is an array
  if (!roles.value || !Array.isArray(roles.value)) {
    return [];
  }

  const sortedRoles = [...roles.value];
  sortedRoles.sort((a, b) => {
    for (const columnName of selectedKey.value) {
      // Untuk kolom lain, gunakan nama kolom itu sendiri
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

  return sortedRoles;
});


onMounted(async () => {
  loadRoles();
})
</script>
<style>
.fill-screen {
  height: 80vh;
  /* Mengisi tinggi viewport penuh */
}</style>