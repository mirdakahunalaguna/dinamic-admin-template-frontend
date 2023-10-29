<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array, // Menambahkan prop untuk daftar opsi
  withIcon: {
    type: Boolean,
    default: false,
  }
})

const select = ref(null) // Mengganti nama ref dari "input" menjadi "select"

const emit = defineEmits(['update:modelValue'])

const focus = () => {
  select.value.focus()
}
</script>

<template>
  <select :class="[
    'w-full border-gray-400 dark:border-gray-500 rounded-md',
    'focus:border-0 focus:ring-2 focus:ring-stone-500  focus:ring-offset-2 focus:ring-offset-white',
    'dark:border-gray-500 dark:bg-dark-eval-1 dark:text-gray-400 dark:focus:ring-offset-dark-eval-1',
    
  ]" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" ref="select">
    <option v-for="option in options"  
      :key="option.value" 
      :value="option.value" 
      :disabled="option.disabled"
      class="">{{ option.label }}</option>
  </select>
</template>

