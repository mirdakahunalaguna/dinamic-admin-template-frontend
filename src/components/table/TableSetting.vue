<template>
  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="flex items-center justify-center">
      <!-- Input Pencarian -->
      <Input
        :value="search" 
        @input="$emit('update:search', $event.target.value)" 
        id="search" type="search"
        v-on:keyup.enter="$emit('searchValueEnter')"
        class="block w-full" 
        placeholder="search" 
        required autofocus />
      <Button icon-only 
        @click="$emit('searchValueButtonClick')" 
        type="submit" class="w-10 ml-4" 
        variant="secondary"
        srText="Toggle dark mode" 
        left-icon="mdi:search"></Button>
    </div>

    <div v-if="element.showTotalDisplay" class="md:text-right">
      <!-- Input Select -->
      <input-select 
        class="w-1/4" 
        :value="length" 
        @input="$emit('update:length', 
        Number($event.target.value))"
        @change="$emit('showTotalDisplayChanged')" 
        :options="selectOptions" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    search: String, // Properti untuk nilai pencarian
    length: Number, // Properti untuk panjang data
    element: Object, // Properti untuk opsi element
  },
};
</script>

<script setup>
import { ref } from 'vue';

const selectOptions = ref([
  { value: '', label: 'Select', disabled: true }, // Placeholder
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
]);
</script>
