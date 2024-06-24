<template>
  <RouterLink v-if="to" :to="to"
    class="py-2 px-3 rounded-md flex items-center gap-2 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer">
    <icon class="w-5 h-5 inline-block" />
    <slot></slot>
  </RouterLink>
  <button v-else
    class="py-2 px-3 rounded-md flex items-center gap-2 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer">
    <icon class="w-5 h-5 inline-block" />
    <slot></slot>
  </button>
</template>

<script setup>
import { RouterLink } from "vue-router"

defineProps(["icon", "to"])
</script>