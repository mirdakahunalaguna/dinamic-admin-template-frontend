<template>
  <nav class="px-4 text-xs md:text-sm py-2 mt-3 float-right border-2 bg-white dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 animate-fade-in-left"
    >
    <ul class="md:grid md:grid-cols-3">
      <li class="w-full p-1 text-center">
        <span>
          {{ pagination.from }} - {{ pagination.to }} of {{pagination.total }}
        </span>
      </li>
      <li v-if="pagination.prevPageUrl" @click="$emit('prevPage')"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
        <a class="flex items-center justify-center gap-2" > 
              <Icon icon="material-symbols:keyboard-double-arrow-left"/> Prev
          </a>
      </li>
      <li class="p-1 hover:bg-gray-100 dark:hover:bg-gray-600" v-else :disabled="true">
        <a class="flex items-center justify-center gap-2" > 
            <Icon icon="material-symbols:keyboard-double-arrow-left"/> Prev
        </a>
      </li>
      <li v-if="pagination.nextPageUrl" @click="$emit('nextPage')"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
        <span class="flex items-center justify-center gap-2">
          Next     
              <Icon icon="material-symbols:keyboard-double-arrow-right"/> 
        </span>
      </li>
      <li class="p-1 hover:bg-gray-100 dark:hover:bg-gray-600" v-else :disabled="true">
        <a class="flex items-center justify-center gap-2" >
          Next
              <Icon icon="material-symbols:keyboard-double-arrow-right"/>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TablePagination',

  props: {
    pagination: {
      type: Object,
      required: true,
    }, 
  },
}
</script>
