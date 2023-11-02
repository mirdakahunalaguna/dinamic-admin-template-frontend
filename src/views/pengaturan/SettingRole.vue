<template>
  <page-wrapper title="config role and permission">
     <template v-if="isLoading"> 
        <loading-screen/> 
      </template>      
        <div class="-mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
         <div>
           <div class="grid grid-cols-1 gap-4 ">
              <div>
                <BaseCard title="asign role to user">
                  <div  class="w-full h-10 -mt-2 flex items-center justify-start ">
                    <InputError v-if="isErrorRole" :message="errorMessageRole" />
                    <InputSuccess v-if="isSuccessRole" :message="successMessageRole" />
                  </div> 
                  <form class="grid grid-cols-1 gap-6 md:w-3/4">
                    <input-select 
                      id="role-name"
                      :options="selectOptions" 
                      v-model="selectedRoleId"/>
                      <div class="grid grid-cols-1 gap-4">
                        <InputIconWrapper @click="searchUsers" icon="mdi:search">
                          <Input
                          withIcon
                          id="search" 
                          type="search"  
                          placeholder="Search User (tab or enter)" 
                          v-model="searchKeyword"
                          @keyup.enter="searchUsers"
                          @keydown.tab="searchUsers"
                          required 
                          /> 
                        </InputIconWrapper> 
                        <base-card title="Search Result ( Choose one by click )" class="bg-gray-100  ">
                        <input type='hidden'
                          v-model="selectedUserId"/>
                          <div v-if="filteredUsers.length > 0" class="mt-4 grid gap-4">
                            <p class="grid grid-cols-3" v-for="user in filteredUsers" :key="user.id" @click="selectUser(user.pegawai.nama, user.id)">
                                <span>{{ user.pegawai.nama }}</span>
                                <span class="ml-4">{{ user.pegawai.nip }}</span>
                                <!-- <span class="ml-4">{{ user.roles.map(role => role.name).join(', ') }}</span> -->
                            </p>
                          </div>
                        </base-card>
                        <div>
                          <Button  
                              type="button"
                              class="justify-center gap-2"
                              variant="secondary" 
                              left-icon="eos-icons:role-binding"
                              @click="assignRole"
                          >
                            <span>Set Role</span>
                          </Button> 
                        </div>
                    </div>              
                  </form>          
                </BaseCard>
              </div>
              <div>
                <BaseCard title="set permission">
                  <div  class="w-full h-10 -mt-2 flex items-center justify-start ">
                    <InputError v-if="isErrorPermission" :message="errorMessagePermission" />
                    <InputSuccess v-if="isSuccessPermission" :message="successMessagePermission" />
                  </div> 
                  <form class="grid grid-cols-1 gap-6">
                    <div class="flex gap-6">
                      <input-select 
                        id="role-name"
                        :options="selectOptions" 
                        v-model="selectedRoleId"
                        class="md:w-2/4"
                      />
                      <div>
                        <Button  
                          type="button"
                          class="justify-center"
                          variant="secondary"
                          srText="Toggle dark mode"
                          left-icon="pajamas:check-sm"
                          @click="showPermissions"
                        >
                          <span>Check</span>
                        </Button>                
                      </div>
                    </div>  
                    <base-card>
                      <div class="grid grid-cols-2 gap-4">
                        <!-- Use v-for to iterate through permissions and generate checkboxes -->
                        <label
                          v-for="permission in permissions"
                          :key="permission.id"
                          class="flex items-center gap-4"
                        >
                          <input-checkbox
                            :key="permission.id"
                            :value="permission.id"
                            v-model="selectedPermissions"
                          />
                          {{ permission.name }}
                        </label>
                      </div> 
                    </base-card>
                    <div>
                      <Button  
                        type="button"
                        class="justify-center gap-2"
                        variant="secondary"
                        srText="Toggle dark mode"
                        left-icon="solar:shield-bold-duotone" 
                        @click="updateRolePermissions"
                      >
                        <span>Set Permission</span>
                      </Button>
                    </div>
                  </form>
                </BaseCard>
              </div> 
            </div>
         </div>
          <div>
            <base-card title="detail role">
            <table-setting
              :element="showElement"
              v-model:search="tableHeader.search"
              v-model:length="tableHeader.length"
              @searchValueEnter="loadUserRoles()"
              @searchValueButtonClick="loadUserRoles()"
              @showTotalDisplayChanged="loadUserRoles()"
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
                <tr v-for="userRole in sortedUserRoles"  
                @click="toggleSortOrder(column.name)" 
                :key="userRole.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="pl-6 py-3 ">{{ userRole.pegawai.nama }} </td>
                <td class="pl-6 py-3">{{ userRole.email }}</td>
                <td class="pl-6 py-3 w-1/4">
                  <span v-for="(role, index) in userRole.roles" :key="index" class="flex gap-1">
                    <!-- Tambahkan tanda "-" di awal setiap elemen -->
                    <span> - </span>
                    <span>{{ role.name }}</span>
                    <!-- Buat baris baru setiap element -->
                    <br v-if="index < userRole.roles.length - 1">
                  </span>
                </td>
                <td class="px-6 py-3 ">
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
                        <button @click.prevent="">
                          <DropdownLink to="#">change role</DropdownLink>
                        </button>
                        <button 
                         @click.prevent=""
                        >
                          <DropdownLink to="#">set default role</DropdownLink>
                        </button>
                      </div>
                    </template>
                  </Dropdown>
                </td>
                </tr>
              </tbody>  
            </TableHeaders>

            </base-card>
          </div>
        </div>
  </page-wrapper>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useStore } from 'vuex';

const tableHeader = computed(() => store.getters['user/tableHeader']);
const userRole = computed(() => store.getters['user/userRoles']);

// State untuk loading dan error handling
const isLoading = ref(false);
const isErrorRole = ref(false);
const isSuccessRole = ref(false);
const isErrorPermission = ref(false);
const isSuccessPermission = ref(false);
const errorMessageRole = ref(null);
const successMessageRole = ref(null);
const errorMessagePermission = ref(null);
const successMessagePermission = ref(null);

const store = useStore();
const selectOptions = ref([]); 
const selectedRoleId = ref('');
const selectedUserId = ref('');
const searchKeyword = ref('');
const filteredUsers = ref([]);  
const selectedPermissions = ref([]);
const permissions = ref([]);
//TARIK SELURUH DATA TABEL ROLE
const fetchRoles = async () => {
  try {
    await store.dispatch('user/getRoles');
    
    const roles = store.state.user.roles;

    if (Array.isArray(roles) && roles.length > 0) {  
      const formattedRoles = roles.map(role => ({ 
        value: role.id, 
        label: role.name, 
      })); 
      formattedRoles.unshift({ value: '', label: 'Pilih role', disabled: true }); 
      selectOptions.value =  formattedRoles; 
      selectedRoleId.value =  formattedRoles[0].value;
    } else {
      console.error('Data Role kosong atau tidak valid.');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data Role:', error);
  }
}
//TARIK SELURUH DATA TABEL USER
const fetchUserLists = async () => {
  try {
    await store.dispatch('user/getUserLists');
    // Handle response di sini jika perlu
  } catch (error) {
    console.error(error);
    // Handle error di sini jika perlu
  }
};
//FUNGSI PENCARIAN DATA USER
const searchUsers = () => {
  const lowercaseSearchKeyword = searchKeyword.value.toLowerCase();
  if (!lowercaseSearchKeyword) {
    // Jika field pencarian kosong, kosongkan filteredUsers
    filteredUsers.value = [];
    return;
  }

  filteredUsers.value = store.state.user.users.filter(user => {
    if (user.pegawai && user.pegawai.nama) {
      const lowercaseNama = user.pegawai.nama.toLowerCase();
      return lowercaseNama.includes(lowercaseSearchKeyword);
    }
    return false; // Jika tidak ada pegawai atau nama pegawai null, abaikan pengguna ini.
  });
}
const selectUser = (userId,userName) => {
  searchKeyword.value = userId;
  selectedUserId.value = userName;
  searchUsers();
}

//TARIK SELURUH DATA TABEL PERMISSIONS
const fetchPermissions = async () => {
  try {     
    await store.dispatch('user/getPermissions'); 
    permissions.value = store.state.user.permissions;
    // console.log(permissions.value)
  } catch (error) { 
    console.error(error);
  }
};
// PROSES INPUT DATA 
const assignRole = async () => {
  isLoading.value = true;
  try {
    const userData = {
      role: selectedRoleId.value,
      user_id: selectedUserId.value,
    };

    // Panggil fungsi setRoleUser di store Vuex Anda dengan await
    await store.dispatch('user/setRoleUser', userData);
    isSuccessRole.value = true;
    successMessageRole.value = 'success asign role to user'
    setTimeout(() => {
      isSuccessRole.value = false;
    }, 3000);
    // Reset nilai selectedRoleId dan selectedUserId setelah berhasil
    selectedRoleId.value = '';
    selectedUserId.value = '';
    searchKeyword.value = '';
    filteredUsers.value = '';
  } catch (error) {
    console.error('Terjadi kesalahan saat mengatur peran pengguna:', error);
    isLoading.value = false;
    isErrorRole.value = true;
    errorMessageRole.value = 'error asign role to user'
    setTimeout(() => {
      isErrorRole.value = false;
    }, 3000); 
  } 
}
//TAMPILKAN PERMISSION SESUAI ROLE TERPILIH
const showPermissions = async () => {
  isLoading.value = true;
  try {
    const role_id = selectedRoleId.value;
    const response = await store.dispatch('user/getRolePermissions', role_id);

    if (response.data) {
      selectedPermissions.value = response.data.map(permission => permission.id);
      console.log(selectedPermissions.value);

      if (selectedPermissions.value.length === 0) {
        isLoading.value = false;
        isErrorPermission.value = true;
        errorMessagePermission.value = 'Role has empty permission'
        setTimeout(() => {
          isErrorPermission.value = false;
        }, 3000);
      }
    } else {
      console.error('Data permissions tidak ditemukan.');
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
  } finally {
    isLoading.value = false;
  }
};

 
//TENTUKAN PERMISSION UNTUK ROLE
const updateRolePermissions = async () => {
  isLoading.value = true;
  try {
    const response = await store.dispatch('user/setRolePermission', {
      role_id: selectedRoleId.value,
      permissions: selectedPermissions.value,
    });
    // Tindakan yang perlu dilakukan setelah permintaan berhasil.
    console.log('Izin peran diperbarui: ', response);
    isSuccessPermission.value = true;
    successMessagePermission.value = 'success asign permission'
    setTimeout(() => {
      isSuccessPermission.value = false;
    }, 3000);
  } catch (error) {
    // Tangani kesalahan jika permintaan gagal.
    console.error('Kesalahan dalam mengatur izin peran:', error);
    isLoading.value = false;
    isErrorPermission.value = true;
    errorMessagePermission.value = 'error asign permission'
    setTimeout(() => {
      isErrorPermission.value = false;
    }, 3000); 
  }
};

// PROSES SETTING TABLE DATA
const showElement = reactive({
  showSearch: true,
  showTotalDisplay: true,
});

const loadUserRoles = (url = '/role-permission/user-role-pegawai') => {
  try {
    isLoading.value = true;
    // Panggil store.dispatch dengan tableHeader yang telah diperbarui
    store.dispatch('user/loadUserRoles', { url, tableHeader: tableHeader.value });

    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};
// PROSES SORTING/PENGURUTAN DATA
let tableColumns = ref([ 
  { indexOf: 0, name: 'nama', label: 'nama', sortable: true},
  { indexOf: 1, name: 'email', label: 'email', sortable: true },
  { indexOf: 2, name: 'roles', label: 'roles', }, 
  { indexOf: 3, name: 'action', label: 'action' },
]);
// Inisialisasi penentuan kolom yang bisa disorting/ tampil ikon sorting.
const sortKey = ref(['nama', 'email',]);
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

const sortedUserRoles = computed(() => {
  const sortedUserRoles = [...userRole.value];
  sortedUserRoles.sort((a, b) => {
    for (const columnName of selectedKey.value) {
      if (columnName === 'nama') {
        // Jika kolom adalah 'nama', gunakan 'pegawai.nama' untuk sorting
        const keyA = a.pegawai.nama ? a.pegawai.nama.toLowerCase() : '';
        const keyB = b.pegawai.nama ? b.pegawai.nama.toLowerCase() : '';

        if (keyA < keyB) {
          return sortOrders[columnName] === 'asc' ? -1 : 1;
        } else if (keyA > keyB) {
          return sortOrders[columnName] === 'asc' ? 1 : -1;
        }
      } else {
        // Untuk kolom lain, gunakan nama kolom itu sendiri
        const keyA = a[columnName] ? a[columnName].toLowerCase() : '';
        const keyB = b[columnName] ? b[columnName].toLowerCase() : '';

        if (keyA < keyB) {
          return sortOrders[columnName] === 'asc' ? -1 : 1;
        } else if (keyA > keyB) {
          return sortOrders[columnName] === 'asc' ? 1 : -1;
        }
      }
    }
    return 0;
  });
  return sortedUserRoles;
});




onMounted(async () => {
  loadUserRoles();
  fetchRoles();
  fetchUserLists();
  fetchPermissions();
});
</script>
<style>
.fill-screen {
  height: 80vh;
  /* Mengisi tinggi viewport penuh */
}</style>