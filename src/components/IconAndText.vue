<template>
  <div class="flex gap-1 items-center">
    <icon class="w-7 h-7 stroke-2" />
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps([
  "icon",
])
</script>