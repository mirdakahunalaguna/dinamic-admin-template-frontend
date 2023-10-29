<template>
  <div v-if="showLoadingScreen"
    class="fixed inset-0 z-50 bg-gradient-to-r from-blue-200 to-cyan-200/20 flex items-center justify-center dark:from-slate-800 dark:to-cyan-800/20">
    <div class="bg-sky-50 border py-2 px-5 rounded-lg flex items-center dark:bg-dark-bg dark:border-dark-eval-1">

      <div class="text-stone-700 text-xl text-center dark:text-white">
        Loading
      </div>
      <div class="loader-dots block relative w-20 h-5 mt-2">
        <div class="absolute top-0 mt-1 w-2 h-2 rounded-full bg-red-500"></div>
        <div class="absolute top-0 mt-1 w-2 h-2 rounded-full bg-yellow-500"></div>
        <div class="absolute top-0 mt-1 w-2 h-2 rounded-full bg-green-500"></div>
        <div class="absolute top-0 mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
      </div>
    </div>
  </div>
</template> 

<script>
export default {
  name: 'LoadingScreen',
  data() {
    return {
      showLoadingScreen: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 3000); // Batas waktu tampil dalam milidetik (dalam contoh ini, 3 detik)
  }
};
</script>
<style>
.loader-dots div {
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.loader-dots div:nth-child(1) {
  left: 8px;
  animation: loader-dots1 0.6s infinite;
}

.loader-dots div:nth-child(2) {
  left: 8px;
  animation: loader-dots2 0.6s infinite;
}

.loader-dots div:nth-child(3) {
  left: 32px;
  animation: loader-dots2 0.6s infinite;
}

.loader-dots div:nth-child(4) {
  left: 56px;
  animation: loader-dots3 0.6s infinite;
}

@keyframes loader-dots1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes loader-dots3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes loader-dots2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}
</style>
