<script setup>
defineProps({
    message: String
})
</script>

<template>
    <div v-show="message" class="z-40 py-4">
        <p class="text-sm font-medium text-blue-900 py-1 pl-2 pr-6 rounded-l-lg 
        bg-gradient-to-r from-red-300 via-rose-200 to-white 
        animate-fade-in-left 
        dark:text-white dark:from-orange-900 dark:via-gray-700 dark:to-gray-800">
            {{ message }}
        </p>
    </div>
</template>
