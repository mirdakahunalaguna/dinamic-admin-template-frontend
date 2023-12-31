<script setup>
import { reactive, ref } from 'vue' 
import { useStore } from 'vuex';
import logoImage from '@/assets/images/corp.png';
import {
  handleScroll,
  isDark,
  scrolling,
  toggleDarkMode,
  sidebarState,
} from '@/composables'

const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
  processing: false,
})

const isLoading = ref(false)
const isError = ref(false) 
const loginErrorMessage = ref(null)

const store = useStore()

const login = async () => {
  try {
    isLoading.value = true;
    clearLoginError();

    const response = await store.dispatch('auth/masuk', loginForm);
    loginForm.processing = true;

    if (response && response.status === 200) {
      console.log('Login successful:', response.data);
      isLoading.value = false;
      // Handle success for status 200
    } else if (response && response.status === 203) {
      // Handle error for status 203
      loginErrorMessage.value = response.data.error;
      isLoading.value = false;
      isError.value = true;
      setTimeout(() => {
        isError.value = false;
      }, 3000);
    } else if (response && response.status === 500) {
      // Handle error for status 500
      loginErrorMessage.value = 'Server error. Please try again later.';
      isLoading.value = false;
      isError.value = true;
      setTimeout(() => {
        isError.value = false;
      }, 3000);
    } else {
      // Handle other errors
      loginErrorMessage.value = 'An error occurred during login.';
    }
  } catch (error) {
    // Handle exceptions
    loginErrorMessage.value = 'An error occurred during login.';
  } finally {
    loginForm.processing = false;
  }
};




const clearLoginError = () => {
  loginErrorMessage.value = null;
};

</script>


<template>
  <template v-if="isLoading"> 
    <loading-screen/> 
  </template> 
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
  <form @submit.prevent="login">
      <div class="grid gap-6">
          <!-- Email input -->
          <div class="space-y-2">
            <div class="grid items-center mt-2 justify-center"> 
              <img :src="logoImage" alt="Logo" class="w-48 h-12"/>
            </div>

            <div  class="w-full h-10 text-center">
              <InputError v-if="isError" :message="loginErrorMessage" />
            </div> 
          </div>
          <!-- Email input -->
          <div class="space-y-2">
              <Label for="email" value="Email" />

              <InputIconWrapper icon="mdi:email-outline">
                  <Input
                      withIcon
                      id="email"
                      type="email"
                      class="block w-full"
                      placeholder="Email"
                      v-model="loginForm.email"
                      required
                      autocomplete="username"
                  />
              </InputIconWrapper>
          </div>
          <!-- Password input -->
          <div class="space-y-2">
              <Label for="password" value="Password" />

              <InputIconWrapper icon="uil:lock-alt">
                  <Input
                      withIcon
                      id="password"
                      type="password"
                      class="block w-full"
                      placeholder="•••••••" 
                      v-model="loginForm.password"
                      required
                      autocomplete="current-password"
                  />
              </InputIconWrapper> 
          </div>

          <!-- Remember me -->
          <div class="flex items-center justify-between">
              <label class="flex items-center">
                  <Checkbox
                      name="remember"
                      v-model:checked="loginForm.remember"
                  />
                  <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <router-link
                  :to="{ name: 'ForgotPassword' }"
                  class="text-sm text-blue-500 hover:underline"
              >
                  Forgot your password?
              </router-link>
          </div>

          <!-- Login button -->
          <div>
              <Button
                  type="submit"
                  class="justify-center w-full gap-2"
                  :disabled="loginForm.processing"
                  left-icon="mdi:login"
              >
                  <span>Log in</span>
              </Button>
            </div>

          <!-- Register link -->
          <p class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <router-link
                  :to="{ name: 'Register' }"
                  class="text-blue-500 hover:underline"
              >
                  Register
              </router-link>
          </p>
      </div>
  </form>
</template> 
