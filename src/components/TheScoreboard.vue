<template>
  <ThePadding class="flex justify-between items-center bg-orange-500 py-2">
    <IconAndText :icon="ClockIcon" class="text-white text-3xl">{{ timeLeft }}</IconAndText>
    <TextBox class="bg-orange-400 text-white text-3xl">{{ score }}</TextBox>
    <IconAndText :icon="HeartIcon" class="text-white text-3xl">{{ hearts }}</IconAndText>
  </ThePadding>
</template>

<script setup>
import TextBox from './TextBox.vue';
import IconAndText from './IconAndText.vue';
import { HeartIcon, ClockIcon } from '@heroicons/vue/24/outline';
import ThePadding from './ThePadding.vue';

defineProps(["score", "hearts", "timeLeft"])
</script>