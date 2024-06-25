<template>
  <ThePadding class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    <div class="bg-white rounded-xl shadow-md overflow-x-auto flex flex-col">
      <header class="relative p-5">
        <div class="mr-8 text-xl font-bold">
          {{ title ?? "Modal" }}
        </div>
        <button type="button"
          class="absolute top-0 right-0 border-none text-2xl p-5 pb-2 cursor-pointer font-bold text-orange-500 bg-transparent"
          @click="close">
          <XMarkIcon class="w-6 h-6 stroke-2" />
        </button>
      </header>

      <section class="relative p-5 pt-0 pb-3 max-h-80 overflow-y-scroll">
        <slot>
          This is the default body!
        </slot>
      </section>

      <footer class="text-sm text-gray-600 flex flex-col justify-end p-5 pt-0">
        <div class="mb-3">
          {{ footer }}
        </div>
        <button type="button" class="text-white bg-orange-500 rounded-lg p-3" @click="close">
          Close
        </button>
      </footer>
    </div>
  </ThePadding>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import ThePadding from './ThePadding.vue'

const emit = defineEmits(["close"])
defineProps(["title", "footer"])

function close() {
  emit("close");
}
</script>