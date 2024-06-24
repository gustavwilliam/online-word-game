<template>
  <div class="px-4 py-6 rounded-md bg-white text-gray-800 flex flex-col items-center justify-start grow">
    <h3 class="uppercase font-semibold">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps(["title"])
</script>