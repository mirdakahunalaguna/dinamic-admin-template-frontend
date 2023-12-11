<script setup>
import { onMounted, onUnmounted,computed} from 'vue'
import { useFullscreen } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import {
    handleScroll,
    isDark,
    scrolling,
    toggleDarkMode,
    sidebarState,
} from '@/composables'
import Button from '@/components/Button.vue'
import Logo from '@/components/Logo.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownLink from '@/components/dropdown/DropdownLink.vue' 
import { useStore } from 'vuex'
const store = useStore();
const logout = () => store.dispatch('auth/logout');

// Menggunakan getter menus dari Vuex
const profile = computed(() => store.getters['auth/profile']);
onMounted(async () => {
  try { 
    await store.dispatch('auth/getUser'); // Gantilah 'namaNamespaceStore' dengan namespace yang sesuai
    // console.log(profile.value)
  } catch (error) {
    console.error('Terjadi kesalahan saat memanggil action getUser:', error);
    // Handle kesalahan sesuai kebutuhan Anda, misalnya menampilkan pesan kesalahan kepada pengguna.
  }
});

const { isFullscreen, toggle: toggleFullScreen } = useFullscreen()

onMounted(() => {
    document.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    document.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <nav
        aria-label="secondary"
        :class="[
            'bg-gray-50 sticky top-0 z-10 px-6 py-4  flex items-center justify-between transition-transform duration-500 dark:bg-dark-eval-1',
            {
                '-translate-y-full': scrolling.down,
                'translate-y-0': scrolling.up,
            },
        ]"
    >
        <div class="flex items-center gap-2">
            <Button
              iconOnly
              variant="secondary"
              @click="toggleDarkMode()"
              v-slot="{ iconSizeClasses }"
              class="hidden md:inline-flex"
              srText="Toggle dark mode"
            >
                <Icon icon="basil:moon-solid" v-show="!isDark" aria-hidden="true" :class="iconSizeClasses" />
                <Icon icon="basil:sun-solid" v-show="isDark" aria-hidden="true" :class="iconSizeClasses" />
            </Button>

                <Button
                  iconOnly
                  variant="secondary"
                  @click="toggleFullScreen"
                  v-slot="{ iconSizeClasses }"
                  class="hidden md:inline-flex"
                  srText="Toggle dark mode"
                >
                    <Icon
                      icon="mdi:arrow-expand-all"
                      v-show="!isFullscreen"
                      aria-hidden="true"
                      :class="iconSizeClasses"
                    />
                    <Icon 
                      icon="mdi:arrow-collapse-all" 
                      v-show="isFullscreen" 
                      aria-hidden="true" 
                      :class="iconSizeClasses" 
                    />
                </Button>
                <Button
                  icon-only
                  variant="secondary"
                  @click="toggleDarkMode()"
                  v-slot="{ iconSizeClasses }"
                  class="md:hidden"
                  srText="Toggle dark mode"
                >
                    <Icon icon="basil:moon-solid" v-show="!isDark" aria-hidden="true" :class="iconSizeClasses" />
                    <Icon icon="basil:sun-solid" v-show="isDark" aria-hidden="true" :class="iconSizeClasses" />
                </Button>
          </div> 
        
        <div class="flex items-center gap-2">
          
                    <span class="font-semibold p-2">{{profile.nama}} </span>
            <!-- Dropdwon -->
            <Dropdown align="right">
                <template #trigger>
                    <Button
                        iconOnly
                        variant="secondary"
                        v-slot="{ iconSizeClasses }"
                        class="hidden md:inline-flex"
                    >
                      <Icon
                        icon="mingcute:user-2-fill"
                        v-show="!isFullscreen"
                        aria-hidden="true"
                        :class="iconSizeClasses"
                      />
                      <Icon
                        icon="mingcute:user-2-fill"
                        v-show="isFullscreen"
                        aria-hidden="true"
                        :class="iconSizeClasses"
                      />
                    </button>
                </template>
                <template #content >
                  <div class="flex flex-col">
                    <button @click.prevent="">
                      <DropdownLink to="#" >Profile</DropdownLink>
                    </button>
                    <button @click.prevent="logout">
                      <DropdownLink to="#" >Keluar</DropdownLink>
                    </button>
                  </div>                  
                </template>
            </Dropdown>
        </div>
    </nav>

    <!-- Mobile bottom bar -->
    <div
        class="z-50"
        :class="[
            'fixed inset-x-0 bottom-0 flex items-center justify-between px-4 py-4 sm:px-6 transition-transform duration-500 bg-white md:hidden dark:bg-dark-eval-1',
            {
                'translate-y-full': scrolling.down,
                'translate-y-0': scrolling.up,
            },
        ]"
    >
        <Button icon="mdi:magnify" 
                iconOnly 
                variant="secondary" 
                srText="Search" 
        />

        <router-link :to="{ name: 'Dashboard' }">
            <Logo class="w-10 h-10" />
            <span class="sr-only">MIRD</span>
        </router-link>

        <Button
            iconOnly
            variant="secondary"
            @click="sidebarState.isOpen = !sidebarState.isOpen"
            v-slot="{ iconSizeClasses }"
            class="md:hidden"
            srText="toggle menu"
        >
            <Icon icon="mdi:menu" v-show="!sidebarState.isOpen" aria-hidden="true"  :class="iconSizeClasses" />
            <Icon icon="mdi:window-close" v-show="sidebarState.isOpen" aria-hidden="true" :class="iconSizeClasses" />
        </Button>
    </div>
</template>
