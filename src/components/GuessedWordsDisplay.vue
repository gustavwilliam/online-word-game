<template>
  <h3 class="text-xl mb-3">Your words</h3>
  <div class="flex gap-2 flex-wrap">
    <TextBox class="bg-white text-gray-700 py-2" v-for="word in guessedWords" :key="word">
      {{ word }}
    </TextBox>
  </div>
</template>

<script setup>
import TextBox from './TextBox.vue';

defineProps(["guessedWords"])
</script>