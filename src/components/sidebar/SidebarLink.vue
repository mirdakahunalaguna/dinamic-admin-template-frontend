<script setup>
import { sidebarState } from '@/composables'
import { Icon } from '@iconify/vue'

defineProps({
  href: {
    type: String,
    required: false,
  },
  to: {
    type: [String, Object],
    required: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  // key: {
  //     type: String,
  //     required: true,
  // },
  icon: {
    type: String,
    default: 'mdi:circle-outline',
  },
})
</script>

<template>
  <a v-if="href" :href="href" :class="[
    'p-2 flex items-center gap-2 rounded-md transition-colors',
    {
      'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-dark-eval-2':
        !active,
      'text-gray-800 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm text-center dark:text-white dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 dark:focus:outline-none':
        active,
    },
  ]">
    <Icon :icon="icon" aria-hidden="true" class="flex-shrink-0 w-6 h-6" />

    <span class="text-base font-medium" v-show="sidebarState.isOpen || sidebarState.isHovered">{{ title }}</span>
  </a>
  <router-link v-else-if="to" :to="to" :class="[
    'p-2 flex items-center gap-2 rounded-md transition-colors',
    {
      'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-dark-eval-2':
        !active,
      'text-gray-800 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm text-center dark:text-white dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 dark:focus:outline-none':
        active,
    },
  ]">
    <Icon :icon="icon" aria-hidden="true" class="flex-shrink-0 w-6 h-6" />

    <span class="text-base font-medium" v-show="sidebarState.isOpen || sidebarState.isHovered">
      {{ title }}
    </span>
  </router-link> <button v-else type="button" :class="[
    'p-2 w-full flex items-center gap-2 rounded-md transition-colors',
    {
      'text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-dark-eval-2':
        !active,
      'text-gray-800 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 hover:bg-gradient-to-br focus:outline-none font-medium rounded-lg text-sm text-center dark:text-white dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 dark:focus:outline-none':
        active,
    },
  ]">
    <Icon :icon="icon" aria-hidden="true" class="flex-shrink-0 w-6 h-6" />

    <span class="text-base font-medium" v-show="sidebarState.isOpen || sidebarState.isHovered">{{ title }}</span>
    <slot name="arrow" />
  </button>
</template>
