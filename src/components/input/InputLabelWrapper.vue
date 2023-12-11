<script setup>
import { ref } from 'vue';

defineProps({ 
  label: {
    type: String,
    required: false
  },
  labelClasses: {
    type: String,
    default: 'w-full',
  },
});
</script>

<template>
  <div class="relative text-gray-500  focus-within:text-gray-900 dark:focus-within:text-gray-400 ">
    <div 
    aria-hidden="true" 
    class="absolute inset-y-0 flex items-center px-4  pointer-events-none text-black dark:text-gray-400">
     <span :label="label" :class="labelClasses">
      {{ label }}
     <span>:</span>
     </span>
    </div>

    <slot class="" />
  </div>
</template>
