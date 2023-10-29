<script setup>
import { toRefs, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator(value) {
            return [
                'primary',
                'secondary',
                'success',
                'danger',
                'warning',
                'info',
                'black',
                'light',
            ].includes(value)
        },
    },
    type: {
        type: String,
        default: 'button',
    },
    size: {
        type: String,
        default: 'base',
        validator(value) {
            return ['sm', 'base', 'lg'].includes(value)
        },
    },
    squared: {
        type: Boolean,
        default: false,
    },
    pill: {
        type: Boolean,
        default: false,
    },
    href: {
        type: String,
    },
    to: {
        type: [String, Object],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    iconOnly: {
        type: Boolean,
        default: false,
    },
    srText: {
        type: String || undefined,
        default: undefined,
    },
    icon: {
        type: String || undefined,
        default: undefined,
    },
    leftIcon: {
        type: String || undefined,
        default: undefined,
    },
    rightIcon: {
        type: String || undefined,
        default: undefined,
    },
})

const emit = defineEmits(['click'])

const {
    type,
    variant,
    size,
    squared,
    pill,
    href,
    iconOnly,
    srText,
    leftIcon,
    rightIcon,
} = props

const { disabled } = toRefs(props)

const baseClasses = [
    'inline-flex items-center transition-colors font-medium select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-eval-2',
]

const variantClasses = (variant) => ({
    'text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 item-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
        variant == 'primary',
    'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-gray-200 font-medium rounded-lg text-sitem-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700':
        variant == 'light',
    'gap-2 border-2 item-center text-sm font-medium text-gray-900 focus:border-0  bg-white rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10  dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700':
        variant == 'secondary',
    "focus:outline-none text-white bg-green-800 hover:bg-green-800 focus:ring-green-300 font-medium rounded-lg text-sitem-center dark:focus:outline-none dark:text-white dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-800 bg-green-500 text-white hover:bg-green-600 focus:ring-1 focus:ring-green-500 font-medium rounded-lg text-sitem-center":
        variant == 'success',
    'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-lg text-sitem-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900bg-red-500 text-white hover:bg-red-600 focus:ring-1 focus:ring-red-500':
        variant == 'danger',
    'focus:outline-none text-gray-900 bg-yellow-400 hover:text-blue-700 hover:bg-yellow-500 focus:ring-yellow-300 font-medium rounded-lg text-sitem-center dark:focus:ring-yellow-900':
        variant == 'warning',
    'focus:outline-none bg-black text-gray-300  hover:text-white hover:bg-gray-800 focus:ring-1 focus:ring-black dark:hover:bg-dark-eval-3':
        variant == 'black',
})

const classes = computed(() => [
    ...baseClasses,
    iconOnly
        ? {
              'p-1.5': size == 'sm',
              'p-2': size == 'base',
              'p-3': size == 'lg',
          }
        : {
              'px-2.5 py-1.5 text-sm': size == 'sm',
              'px-4 py-2 text-base': size == 'base',
              'px-5 py-2 text-xl': size == 'lg',
          },
    variantClasses(variant),
    {
        'rounded-md': !squared && !pill,
        'rounded-full': pill,
    },
    {
        'pointer-events-none opacity-50': href && disabled.value,
    },
])

const iconSizeClasses = [
    {
        'w-5 h-5': size == 'sm',
        'w-6 h-6': size == 'base',
        'w-7 h-7': size == 'lg',
    },
]

const handleClick = (e) => {
    if (disabled.value) {
        e.preventDefault()
        e.stopPropagation()
        return
    }
    emit('click', e)
}
</script>

<template>
    <router-link
        v-if="to"
        :to="!disabled ? to : null"
        :class="classes"
        :aria-disabled="disabled.toString()"
    >
        <span v-if="srText" class="sr-only">{{ srText }}</span>
        <Icon
            v-if="leftIcon"
            :icon="leftIcon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
        <Icon
            v-if="icon && iconOnly"
            :icon="icon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
        <slot :iconSizeClasses="iconSizeClasses" />
        <Icon
            v-if="rightIcon"
            :icon="rightIcon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
    </router-link>
    <a
        v-else-if="href"
        :href="!disabled ? href : null"
        :class="classes"
        :aria-disabled="disabled.toString()"
    >
        <span v-if="srText" class="sr-only">{{ srText }}</span>
        <Icon
            v-if="leftIcon"
            :icon="leftIcon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
        <Icon
            v-if="icon && iconOnly"
            :icon="icon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
        <slot :iconSizeClasses="iconSizeClasses" />
        <Icon
            v-if="rightIcon"
            :icon="rightIcon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
    </a>
    <button
        v-else
        :type="type"
        :class="classes"
        @click="handleClick"
        :disabled="disabled"
    >
        <span v-if="srText" class="sr-only">{{ srText }}</span>
        <Icon
            v-if="leftIcon"
            :icon="leftIcon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
        <Icon
            v-if="icon && iconOnly"
            :icon="icon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
        <slot :iconSizeClasses="iconSizeClasses" />
        <Icon
            v-if="rightIcon"
            :icon="rightIcon"
            :class="iconSizeClasses"
            aria-hidden="true"
        />
    </button>
</template>
