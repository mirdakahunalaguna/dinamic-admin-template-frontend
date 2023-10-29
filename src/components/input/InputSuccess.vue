<script setup>
defineProps({
  message: String
})
</script>

<template>
  <div v-show="message" class="z-50 py-4">
    <p
      class="text-sm font-medium text-blue-900 
      bg-gradient-to-r from-green-300 via-green-200 to-slate-50 
      animate-fade-in-left py-1 pl-2 pr-6 rounded-l-lg 
      dark:text-white dark:from-green-800 dark:via-gray-700 dark:to-gray-800">
        {{ message }}
    </p>
  </div>
</template>
