<template>
  <TheScoreboard :hearts="hearts" :timeLeft="timeLeft" :score="score"></TheScoreboard>
  <ThePadding>
    <NavigationGroup>
      <NavigationButton :icon="ChevronLeftIcon" to="/">Exit to main menu</NavigationButton>
      <NavigationButton :icon="ArrowPathIcon" :onclick="newLetter" v-if="activeGame">New word</NavigationButton>
    </NavigationGroup>
    <div v-if="activeGame">
      <h1 class="uppercase font-[jost] text-5xl mt-10 mb-7">{{ currentWord }}</h1>
      <GuessedWordsDisplay :guessedWords=guessedWords />
      <TheInput></TheInput>
    </div>
    <div v-else class="w-full h-full">
      <h1 class="text-4xl mt-8 mb-6">Word Game</h1>
      <p>When you start the game, you'll be given a random word. Make as many words with the letters of the word as
        possible, before the time runs out! And be careful — make too many mistakes and you lose.</p>
      <button :onclick="startGame" class="bg-orange-500 w-full py-3 rounded-lg mt-4 text-lg text-white">
        Start game
      </button>
    </div>
  </ThePadding>
  <div v-show="activeGame" class="absolute bottom-0 left-0 mb-4 md:mb-36 lg:mb-56 w-full">
    <ThePadding class="w-full">
      <form @submit.prevent="submitWord" class="flex flex-row gap-2 h-12 w-full">
        <input type="text" v-model="newWord" placeholder="Enter a word..." autofocus onblur="this.focus()"
          @keypress="isLetter($event)" class="w-full rounded-lg text-xl px-4 outline-orange-500">
        <button type="submit"
          class="bg-orange-500 rounded-lg aspect-square flex items-center justify-center hover:bg-orange-600">
          <PaperAirplaneIcon class="w-8 h-8 text-white" />
        </button>
      </form>
    </ThePadding>
  </div>
</template>

<script setup>
import TheInput from '../components/TheInput.vue';
import TheScoreboard from '../components/TheScoreboard.vue';
import ThePadding from '../components/ThePadding.vue';
import GuessedWordsDisplay from '../components/GuessedWordsDisplay.vue'
import { ChevronLeftIcon, ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/vue/20/solid';
import NavigationGroup from '../components/NavigationGroup.vue';
import NavigationButton from '../components/NavigationButton.vue'
import { nextTick, onMounted, reactive, ref } from 'vue';

let currentWord = ref("")
let wordList;
let activeGame = ref(false);
let hearts = ref(5);
let timeLeft = ref(45);
let score = ref(0);
let countdown;
let guessedWords = reactive([])
let newWord = ref("")

function Counter(array) {
  var count = {};
  array.forEach(val => count[val] = (count[val] || 0) + 1);
  return count;
}

function isLetter(e) {
  let char = String.fromCharCode(e.keyCode);
  if (char === " ") e.preventDefault();
  return true;
}

function addCorrectWord(word) {
  if (word === currentWord.value || guessedWords.includes(word)) {
    // Highlight the word, so the player gets feedback that it's already added
    return;
  }

  guessedWords.push(word);
  score.value += 1;
}

function wordIsCorrect(word) {
  const currentWordC = Counter(currentWord.value.split(""));
  const guessWordC = Counter(word.split(""));

  for (let i in guessWordC) { // Is using only the required letters
    if ((currentWordC[i] ?? 0) < guessWordC[i].valueOf()) return false;
  }

  return wordList.includes(word);
}

function submitWord() {
  if (!activeGame) return;
  if (newWord.value.length < 1) return;

  if (wordIsCorrect(newWord.value)) {
    addCorrectWord(newWord.value)
    newWord.value = "";
  } else {
    hearts.value -= 1;
  }
}

function countdownSecond() {
  timeLeft.value -= 1;
}

function resetGameState() {
  clearInterval(countdown);
  hearts.value = 5;
  timeLeft.value = 45;
  score.value = 0;
  guessedWords = reactive([])
}

function startGame() {
  console.log("Starting game.")
  activeGame.value = true;
  countdown = setInterval(countdownSecond, 1000)
}

function newLetter() {
  newGame();
  startGame();
}

function newGame() {
  resetGameState()
  do {
    const randomNumber = Math.floor(Math.random() * wordList.length);
    currentWord.value = wordList[randomNumber];
  } while (currentWord.value === "" || currentWord.value.length > 9 || currentWord.value.length < 7)
}

async function setupGame() {
  await import(`/wordlist/english.txt?raw`)
    .then((a) => {
      wordList = a.default.split(";");
      newGame();
    })
}

onMounted(() => {
  setupGame()
})
</script>