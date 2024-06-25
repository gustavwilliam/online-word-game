<template>
  <div class="px-4 py-6 rounded-md text-gray-800 bg-white flex flex-col items-center justify-start grow"
    :class="{ 'hover:cursor-pointer hover:bg-slate-50': clickable }">
    <h3 class="uppercase font-semibold">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps(["title", "clickable"])
</script>