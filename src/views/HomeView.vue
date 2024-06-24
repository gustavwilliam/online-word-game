<template>
  <ThePadding class="pt-4">
    <h1 class="text-4xl text-center py-6">Word Game</h1>
    <div class="flex w-full flex-col gap-2">
      <RouterLink to="/game" class="bg-orange-500 text-white px-4 py-3 rounded-md">Start Online Game</RouterLink>
      <RouterLink to="/checker" class="bg-white px-4 py-3 rounded-md">Open Word Checker</RouterLink>
    </div>
  </ThePadding>
</template>

<script setup>
import ThePadding from '../components/ThePadding.vue';
</script>