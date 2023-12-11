<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-40 p-4 text-center bg-slate-800/20 rounded-lg shadow dark:bg-slate-400/20 sm:p-5"
    v-if="isOpen">
    <base-card title="Edit Sub-Menu">
      <div class="mt-8">
        <form @submit.prevent="updateSubmenu" 
              class="grid grid-cols-1 gap-2 px-8">
          <Label 
            for="name" 
            value="Name" 
            class="text-left"/>
          <input-select
            :options="selectOptions"
            v-model="editedSubmenu.menu_id"
          />
          <Label 
              for="name" 
              value="Sub-menu Name" 
              class="text-left" />
            <Input type="text" v-model="editedSubmenu.title" />          
          <Label 
            for="name" 
            value="Route to" 
            class="text-left"/>
            <Input type="text" v-model="editedSubmenu.to" /> 


          <div class="p-4 grid grid-cols-1 gap-4">
            <p class="text-gray-700 dark:text-gray-300 text-lg">Are you sure you want to edit this item?</p>

            <div class="flex justify-center items-center space-x-8">
              <Button variant="light" @click="closeModal"> <span class="mx-2"> No </span>
              </button>
              <Button variant="primary" type="submit"> Yes
              </button>
            </div>
          </div>
        </form>
      </div>
    </base-card>
  </div>
</template>

<script>
export default {
  
  props: {
    isOpen: Boolean,
    editedSubmenu: Object,
    selectOptions: Array,
    confirm: Boolean, // Tambahkan properti confirm dengan tipe Boolean
  },
  setup(props, { emit }) { 
    const updateSubmenu = () => {
      // Panggil action updateSubmenu dari Vuex dengan data yang akan diubah
      emit('update-submenu', props.editedSubmenu);
    };

    const closeModal = () => {
      // Tutup modal ketika tombol close diklik
      emit('close');
    };
    
    return { 
      updateSubmenu,
      closeModal,
    };
  },
};
</script>
