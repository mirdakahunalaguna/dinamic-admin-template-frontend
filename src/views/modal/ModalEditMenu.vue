<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-40 p-4 text-center bg-slate-800/20 rounded-lg shadow dark:bg-slate-400/20 sm:p-5"
    v-if="isOpen">
    <base-card 
        title="Edit Menu"> 
        <div class="mt-8"> 
            <form @submit.prevent="updateMenu" class="grid grid-cols-1 gap-2 px-8" >
                <Label for="name" value="Name" class="text-left"/>
                  <Input                     
                      type="text"
                      v-model="editedMenu.title"
                  />  
              <Label for="name" value="icon name" class="text-left"/>
              <div class="flex gap-4 justify-between">
                <div>
                    <Input                       
                        type="text"
                        v-model="editedMenu.icon"
                    />
                </div> 
                <a
                    class="p-2 font-semibold border-2 rounded-md "
                    href="https://icon-sets.iconify.design/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                ><span class="text-rose-600">* </span>cari
                </a>
              </div>
              <Label for="name" value="route to" class="text-left"/>
                    <Input                     
                        type="text"
                        v-model="editedMenu.to"
                    /> 

              <div class="p-4 grid grid-cols-1 gap-4">
                <p class="text-gray-700 dark:text-gray-300 text-lg">Are you sure you want to edit this item?</p>
          
                <div class="flex justify-center items-center space-x-8">       
                  <Button
                      variant="light"  
                      @click="closeModal"
                    > <span class="mx-2"> No  </span>  
                  </button>
                  <Button
                      variant="primary"
                      type="submit"
                    >  Yes
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
    editedMenu: Object,
    confirm: Boolean, // Tambahkan properti confirm dengan tipe Boolean
  },
  setup(props, { emit }) {
    const updateMenu = () => {
      // Panggil action updateMenu dari Vuex dengan data yang akan diubah
      emit('update-menu', props.editedMenu);
    };

    const closeModal = () => {
      // Tutup modal ketika tombol close diklik
      emit('close');
    };

    return {
      updateMenu,
      closeModal,
    };
  }, 
};
</script>
