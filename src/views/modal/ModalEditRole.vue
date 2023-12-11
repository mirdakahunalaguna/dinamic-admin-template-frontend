<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-40 p-4 text-center bg-slate-800/20 rounded-lg shadow dark:bg-slate-400/20 sm:p-5"
    v-if="isOpen">
    <base-card title="Edit Role">
      <div class="mt-8">
        <form @submit.prevent="updateRole" class="grid grid-cols-1 gap-2 px-8">
          <Label for="name" value="Name" class="text-left" />
          <Input type="text" v-model="editedRole.name" />
          <div class="p-4 grid grid-cols-1 gap-4">
            <p class="text-gray-700 dark:text-gray-300 text-lg">Are you sure you want to edit this item ?</p>

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
    editedRole: Object,
    confirm: Boolean, // Tambahkan properti confirm dengan tipe Boolean
  },
  setup(props, { emit }) {
    const updateRole = () => {
      // Panggil action updateRole dari Vuex dengan data yang akan diubah
      emit('update-role', props.editedRole);
    };

    const closeModal = () => {
      // Tutup modal ketika tombol close diklik
      emit('close');
    };

    return {
      updateRole,
      closeModal,
    };
  },
};
</script>
