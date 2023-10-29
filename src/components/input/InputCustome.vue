<template>
  <div >
    <div class="relative h-10 w-full min-w-[200px]">
      <input
        v-model="inputValue"
        class="w-full px-8 peer h-full border-b-2 border-gray-400 bg-transparent font-sans text-base dark:text-gray-400 font-normal outline outline-0 transition-all placeholder-shown:border-blue-gray-700 focus:border-grey-700 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-500"
        placeholder=" "
        :disabled="disabled"
      />
      <label class="w-full after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-400 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-grey-500 peer-focus:after:scale-x-100 peer-focus:after:border-gray-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-400  ">
        {{ label }}
      </label> 
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    label: {
      type: String,
      default: 'beri label'
    },
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false // Default is not disabled
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue);

    watch(inputValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    // Reset nilai inputValue saat nilai modelValue berubah
    watch(() => props.modelValue, (newValue) => {
      inputValue.value = newValue;
    });

    return {
      inputValue
    };
  }
};
</script>
