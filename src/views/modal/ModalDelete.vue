<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 p-4 text-center bg-slate-800/20 rounded-lg shadow dark:bg-slate-400/20 sm:p-5"
    v-if="isOpen">
    <base-card title="Hapus Menu">
      <button icon="pepicons-pencil:trash-circle-filled"></button>
      <svg class="text-rose-800 dark:text-rose-500 w-11 h-11 mb-3.5 mx-auto animate-bounce" aria-hidden="true"
        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"></path>
      </svg>
      <p class="mb-4 text-gray-700 dark:text-gray-300 text-lg">
        Are you sure you want to delete item <span class="text-red-700">"{{ itemName }}"</span> ?
         <!-- Menampilkan itemName -->
      </p>
      <div class="flex justify-center items-center space-x-8">

        <Button iconOnly variant="light" @click="cancel"> <span class="mx-2"> No </span>
        </button>
        <Button iconOnly variant="primary" @click="confirm"> Yes
        </button>
      </div>
    </base-card>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    isOpen: Boolean,
    isDarkMode: Boolean, // Tambahkan prop untuk dark mode
    deleteId: Number, // Tambahkan prop untuk ID menu yang akan dihapus
    itemName: String, // Tambahkan prop untuk nama item yang akan dihapus
  },
  setup(props, { emit }) {
    const cancel = () => {
      emit('close');
    };

    const confirm = () => {
      // Kirim ID menu yang akan dihapus ke komponen utama
      emit('confirm-delete', props.deleteId);
      emit('close');
    };

    return {
      cancel,
      confirm,
    };
  },
};
</script>
