<template>
  <ThePadding>
    <NavigationGroup>
      <NavigationButton :icon="ChevronLeftIcon" to="/">Exit to main menu</NavigationButton>
    </NavigationGroup>
    <div class="mt-4">
      <h1 class="text-4xl font-bold mt-7 mb-4">Search word</h1>
      <form @submit.prevent="viewSolutions" class="flex flex-row gap-2 h-12 w-full">
        <input id="inputField" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          v-model="currentWord" @input="showSolutions = false" placeholder="Enter a word..." autofocus
          onblur="this.focus()" @keypress="isLetter($event)" class="w-full rounded-lg text-xl px-4 outline-orange-500">
        <button type="submit"
          class="bg-orange-500 rounded-lg aspect-square flex items-center justify-center hover:bg-orange-600">
          <PaperAirplaneIcon class="w-8 h-8 text-white" />
        </button>
      </form>
      <label for="inputField" class="text-sm text-gray-600 ml-1 mt-2" v-if="!showSolutions">Press enter to
        search</label>
    </div>
    <div class="mt-4">
      <GuessesWordsDisplay v-if="showSolutions && possibleSolutions.length >= 1" :guessedWords=possibleSolutions
        :normalOrder="true" />
      <div v-else-if="showSolutions && possibleSolutions.length < 1" class="mt-6">
        There are no solutions for "{{ currentWord }}".
      </div>
      <div v-else class="w-full flex justify-center">
        <img src="/illustrations/search.svg" alt="Search image" class="mt-28 w-full md:w-96" />
      </div>
    </div>
  </ThePadding>
</template>

<script setup>
import GuessesWordsDisplay from '../components/GuessedWordsDisplay.vue'
import { ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/vue/20/solid';
import { onMounted, reactive, ref } from 'vue';
import ThePadding from '../components/ThePadding.vue';
import NavigationGroup from '../components/NavigationGroup.vue';
import NavigationButton from '../components/NavigationButton.vue';

let currentWord = ref("");
let wordList;
let possibleSolutions = reactive([]);
let showSolutions = ref(false);

function getAllSolutions() {
  possibleSolutions.length = 0;
  for (let word of wordList) {
    if (wordIsCorrect(word)) possibleSolutions.push(word);
  }
  showSolutions.value = true;
}

function isLetter(e) {
  let char = String.fromCharCode(e.keyCode);
  if (char === " ") e.preventDefault();
  return true;
}

function wordIsCorrect(word) {
  word = word.replaceAll(/\s+/g, '')
  const currentWordC = Counter(currentWord.value.split(""));
  const guessWordC = Counter(word.split(""));

  for (let i in guessWordC) { // Is using only the required letters
    if ((currentWordC[i] ?? 0) < guessWordC[i].valueOf()) return false;
  }

  return wordList.includes(word);
}

function Counter(array) {
  var count = {};
  array.forEach(val => count[val] = (count[val] || 0) + 1);
  return count;
}

function viewSolutions() {
  if (currentWord.value.length >= 1) {
    getAllSolutions();
  }
}

async function setupWordList() {
  await import(`/wordlist/english.txt?raw`)
    .then((a) => {
      wordList = a.default.split(";");
    })
}

onMounted(() => {
  setupWordList();
})
</script>