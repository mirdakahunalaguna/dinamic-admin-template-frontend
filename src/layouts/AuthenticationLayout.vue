<script setup>
import PageFooter from '@/components/PageFooter.vue'
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen gap-4 py-6 bg-gradient-to-r from-sky-200 via-stone-100 to-sky-200 dark:bg-gradient-to-r-dark dark:from-slate-800 dark:via-sky-800 dark:to-slate-800">
    <main class="flex items-center flex-1 w-full sm:max-w-md">
      
      <div class="w-full px-6 py-4 overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-dark-eval-1 dark:text-white">
        <router-view></router-view>
      </div>
    </main>

    <PageFooter />
  </div>
</template>
