<template>
  <div>
    <h3 class="text-xl mb-2">{{ title }}</h3>
    <div class="flex gap-2 flex-wrap" :class="{ 'justify-end flex-wrap-reverse flex-row-reverse': !normalOrder }">
      <TextBox class="text-gray-700 py-2"
        :class="{ 'bg-slate-100': (isDone === true), 'bg-white': !(isDone === true), '!bg-green-400': (actualGuesses ?? []).includes(word) }"
        v-for="word in guessedWords" :key="word">
        {{ word }}
      </TextBox>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import TextBox from './TextBox.vue';

const props = defineProps(["guessedWords", "title", "normalOrder", "actualGuesses", "isDone"])

onMounted(() => {
  console.log(props.guessedWords)
  console.log(props.actualGuesses)
})
</script>