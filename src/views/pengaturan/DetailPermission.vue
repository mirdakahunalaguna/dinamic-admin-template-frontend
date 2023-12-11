<template>
  <page-wrapper title="handling data permission"> 
      <template v-if="isLoading"> 
        <loading-screen/> 
      </template>
      <!-- komponen modal delete -->
        <modal-delete
          :is-open="isDeleteModalOpen"
          :deleteId="deleteId"
          :itemName="itemName"
          @close="isDeleteModalOpen = false"
          @confirm-delete="deletePermission" 
          v-if="isDeleteModalOpen"/>
      <!-- Gunakan komponen EditModal -->
        <modal-edit-permission
          :is-open="isEditModalOpen" 
          :editedPermission="editedPermission" 
          @update="updatePermission" 
          @close="isEditModalOpen = false"/>
      <div class="-mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"> 
          <div>
            <BaseCard 
            title="create permission"
            :actions="[{ title: 'back', to: 'setting-role' }]" >
              <div  class="w-full h-10 -mt-2 flex items-center justify-start ">
                <InputError v-if="isError" :message="errorMessage" />
                <InputSuccess v-if="isSuccess" :message="successMessage" />
              </div> 
              <form @submit.prevent="createPermission" class="grid grid-cols-1 gap-6 md:w-3/4">
                <InputLabelWrapper label="permission name" >
                  <Input
                    withLabel
                    type="text"
                    class="pl-40" 
                    v-model="permissionName"
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
            <base-card title="table permission">
              <TableSetting
                :element="showElement" 
                v-model:search="tableHeader.search"
                v-model:length="tableHeader.length"
                @searchValueEnter="loadPermissions()"
                @searchValueButtonClick="loadPermissions()"
                @showTotalDisplayChanged="loadPermissions()"
                @keyup.enter="loadPermissions()"
                @keydown.tab="loadPermissions()"
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
                  <tr v-for="(permissions, index) in sortedPermissions"  
                  @click="toggleSortOrder(column.name)" 
                  :key="permissions.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td class="pl-6 py-3 w-16">{{ index + 1 }}</td> 
                  <td class="pl-6 py-3 ">{{ permissions.name }} </td> 
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
                          <button @click.prevent="openModalEditPermission(permissions)">
                            <DropdownLink to="#">edit permission</DropdownLink>
                          </button>
                          <button @click.prevent="prepareDelete(permissions.id, permissions.name)"
                            :disabled="!permissions.id">
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
              @prevPage="loadPermissions(paginationData.prevPageUrl)"
              @nextPage="loadPermissions(paginationData.nextPageUrl)"
            />
          </div>
        </div>

  </page-wrapper>
</template>
<script setup>
import ModalEditPermission from '@/views/modal/ModalEditPermission.vue'

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
const permissions = computed(() => store.getters['user/permissions']);

// PROSES SETTING TABLE DATA
const showElement = reactive({
  showSearch: true,
  showTotalDisplay: true,
});
const loadPermissions = (url = '/permissions') => {
  try {
    isLoading.value = true;
    // Panggil store.dispatch dengan tableHeader yang telah diperbarui
    store.dispatch('user/loadPermissions', { url, tableHeader: tableHeader.value });

    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};
// PROSES SORTING/PENGURUTAN DATA
let tableColumns = ref([
  { indexOf: 0, name: 'no', label: 'no', width: '5%' },
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
const sortedPermissions = computed(() => {
  // Check if permissions.value is defined and is an array
  if (!permissions.value || !Array.isArray(permissions.value)) {
    return [];
  }

  const sortedPermissions = [...permissions.value];
  sortedPermissions.sort((a, b) => {
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
  return sortedPermissions;
});

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
const deletePermission = async () => {
  try {
    isLoading.value = true;
    // Panggil aksi deletePermission dari Vuex dengan ID menu yang akan dihapus
    await store.dispatch('user/deletePermission', deleteId.value);
    isLoading.value = false;
    isDeleteModalOpen.value = false;
    loadPermissions();
  } catch (error) {
    console.error('Gagal menghapus permission', error);
  }
};

// PROSES UPDATE PERMISSION
const isEditModalOpen = ref(false);
const editedPermission = ref({ name: '' });

// Fungsi untuk membuka modal edit Permission
const openModalEditPermission = (permissions) => {
  // Buka modal edit dan isi data Permission yang akan diubah
  editedPermission.value = { ...permissions, id: permissions.id };
  isEditModalOpen.value = true;
};
// Fungsi untuk mengupdate menu
const updatePermission = async (updatedPermission) => {
  try {
    isLoading.value = true;
    // Panggil action update dari Vuex dengan data yang akan diubah
    await store.dispatch('user/updatePermission', { id: editedPermission.value.id, permissionData: updatedPermission });
    isLoading.value = false;
    isEditModalOpen.value = false; // Tutup modal setelah pengeditan selesai
    loadPermissions(); // Muat ulang menu setelah mengubah
  } catch (error) {
    console.error('Terjadi kesalahan saat mengubah Permission', error);
    isLoading.value = false;
    // Handle error, misalnya dengan menampilkan pesan kesalahan kepada pengguna
  }
};
//PROSES CREATE DATA ROLE
const permissionName = ref(null);
const createPermission = async () => {
  try {
    isLoading.value = true;
    isError.value = false; // Reset isError
    // Persiapkan data permission yang akan dikirim
    const permissionData = {
      name: permissionName.value,
      // ...Tambahkan data lainnya sesuai kebutuhan
    };
    // Menggunakan action createMenu dari Vuex untuk membuat menu baru
    await store.dispatch('user/createPermission', permissionData);
    loadPermissions();
    // After adding the permission successfully, reset the form
    isSuccess.value = true;
    successMessage.value = 'succes create new permission'
    setTimeout(() => {
      isSuccess.value = false;
    }, 3000);
    isLoading.value = false;
    permissionName.value = null;
  } catch (error) {
    console.error('Terjadi kesalahan saat membuat permission:', error);
    isLoading.value = false;
    isError.value = true;
    errorMessage.value = 'An error occurred while adding the menu. Please try again.'; // Set errorMessage
    setTimeout(() => {
      isError.value = false;
    }, 3000);
  }
}
onMounted(async () => {
  loadPermissions();
})
</script>


<style>
.fill-screen {
  height: 80vh;
  /* Mengisi tinggi viewport penuh */
}
</style>