<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <tr>
        <th v-for="column in columns" :key="column.name"
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <div class="text-left">
            <div class="pl-6 pr-2 py-3 flex items-center justify-between">
              <span>{{ column.label }}</span>
              <div v-if="props.sortKey.includes(column.name)" @click="toggleSortOrder(column.name)">
                <Icon
                  :icon="props.sortKey.includes(column.name) ? (props.sortOrders[column.name] === 'asc' ? 'fa-chevron-down' : 'fa-chevron-up') : 'fa-sort'" />
              </div>
            </div>
          </div>
        </th>
      </tr>
      <slot></slot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TableHeaders',
  props: {
    columns: {
      type: Array,
      default: null
    },
    sortKey: {
      type: Array,
      default: null
    },
    selectedKey: {
      type: Array,
      default: null
    },
    sortOrders: {
      type: Object,
      default: null
    },
  },
  setup(props) {
     const toggleSortOrder = (columnName) => {
      if (props.selectedKey.includes(columnName)) {
        const index = props.selectedKey.indexOf(columnName);
        props.selectedKey.splice(index, 1);
      } else {
        props.selectedKey.push(columnName);
      }

      // Reset urutan pengurutan untuk kolom yang diubah
      props.sortOrders[columnName] = props.sortOrders[columnName] === 'asc' ? 'desc' : 'asc';
    };
    
    return {
      props,
      toggleSortOrder,
    };
  }
};
</script>
