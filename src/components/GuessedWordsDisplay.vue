<template>
  <div>
    <h3 class="text-xl mb-2">{{ title }}</h3>
    <div class="flex gap-2 flex-wrap-reverse flex-row-reverse justify-end">
      <TextBox class="bg-white text-gray-700 py-2" v-for="word in guessedWords" :key="word">
        {{ word }}
      </TextBox>
    </div>
  </div>
</template>

<script setup>
import TextBox from './TextBox.vue';

defineProps(["guessedWords", "title"])
</script>