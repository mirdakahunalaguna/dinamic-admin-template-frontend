<template>
  <input 
  class="bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-700 text-gray-500 focus:ring-gray-200 dark:focus:ring-gray-500 rounded-sm"
  type="checkbox" :value="value" v-model="isChecked" @change="handleChange" />
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    modelValue: {
      required: true,
    },
  },
  data() {
    return {
      isChecked: this.modelValue,
    };
  },
  watch: {
    modelValue(newVal) {
      this.isChecked = newVal;
    },
  },
  methods: {
    handleChange() {
      this.$emit('update:modelValue', this.isChecked);
    },
  },
};
</script>
