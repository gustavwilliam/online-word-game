<template>
  <TheScoreboard :hearts="hearts" :timeLeft="timeLeft" :score="score" :totalCorrectWords="possibleSolutions.length">
  </TheScoreboard>
  <ThePadding>
    <NavigationGroup>
      <NavigationButton :icon="ChevronLeftIcon" to="/">Exit to main menu</NavigationButton>
      <NavigationButton :icon="ArrowPathIcon" @click="newLetter" v-if="activeGame || showFinish">New word
      </NavigationButton>
      <NavigationButton :icon="ChevronDoubleRightIcon" @click="endGame('Game finished!')" v-if="activeGame">Finish early
      </NavigationButton>
    </NavigationGroup>
    <div v-show="activeGame" class="mb-4 w-full">
      <form @submit.prevent="submitWord" class="flex flex-row gap-2 h-12 w-full">
        <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          v-model="newWord" placeholder="Enter a word..." autofocus onblur="this.focus()" @keypress="isLetter($event)"
          class="w-full rounded-lg text-xl px-4 outline-orange-500">
        <button type="submit"
          class="bg-orange-500 rounded-lg aspect-square flex items-center justify-center hover:bg-orange-600">
          <PaperAirplaneIcon class="w-8 h-8 text-white" />
        </button>
      </form>
    </div>
    <div class="mt-10">
      <div v-if="activeGame">
        <h1 class="uppercase font-[jost] text-5xl mb-7">{{ currentWord }}</h1>
        <GuessedWordsDisplay :guessedWords=guessedWords title="Correct guesses" class="mb-6" />
        <GuessedWordsDisplay :guessedWords=guessedFails title="Incorrect guesses" />
      </div>
      <div v-else-if="showFinish">
        <h1 class="text-4xl font-bold mb-2">{{ endMessage }}</h1>
        <p>Well done! Here are your stats for this game:</p>
        <div class="mt-8 flex gap-2 flex-col">
          <WordsFoundBox title="Word" class="w-full"><span class="text-4xl font-[jost] uppercase">{{ currentWord
              }}</span></WordsFoundBox>
          <div class="flex w-full gap-2">
            <WordsFoundBox title="Found" @click="showModal" :clickable="true"><span class="text-4xl">{{ score }}</span>
            </WordsFoundBox>
            <WordsFoundBox title="Possible" @click="showModal" :clickable="true"><span class="text-4xl">
                {{ possibleSolutions.length }}
              </span></WordsFoundBox>
            <WordsFoundBox title="Complete" @click="showModal" :clickable="true"><span class="text-4xl">{{
              Math.round(score * 100 / possibleSolutions.length) }}%</span>
            </WordsFoundBox>
          </div>
        </div>
        <button @click="startGame" class="bg-orange-500 w-full py-3 rounded-lg mt-4 text-lg text-white">
          Play again
        </button>
      </div>
      <div v-else class="w-full h-full mb-7">
        <h1 class="text-4xl mb-4">Word Game</h1>
        <p>When you start the game, you'll be given a random word. Make as many words with the letters of the word as
          possible, before the time runs out! And be careful — make too many mistakes and you lose.</p>
        <button @click="startGame" class="bg-orange-500 w-full py-3 rounded-lg mt-4 text-lg text-white">
          Start game
        </button>
      </div>
    </div>
  </ThePadding>
  <TheModal v-show="isModalVisible" @close="closeModal" :title="`Combinations for ${currentWord}`">
    <GuessedWordsDisplay :guessedWords="possibleSolutions" :normalOrder="true" :actualGuesses="guessedWords"
      :isDone="true">
    </GuessedWordsDisplay>
  </TheModal>
</template>

<script setup>
import TheScoreboard from '../components/TheScoreboard.vue';
import ThePadding from '../components/ThePadding.vue';
import WordsFoundBox from '../components/WordsFoundBox.vue'
import GuessedWordsDisplay from '../components/GuessedWordsDisplay.vue'
import { ChevronLeftIcon, ArrowPathIcon, PaperAirplaneIcon, ChevronDoubleRightIcon } from '@heroicons/vue/20/solid';
import NavigationGroup from '../components/NavigationGroup.vue';
import NavigationButton from '../components/NavigationButton.vue'
import TheModal from '../components/TheModal.vue';
import { nextTick, onMounted, reactive, ref } from 'vue';

let currentWord = ref("")
let wordList;
let activeGame = ref(false);
let hearts = ref(5);
let timeLeft = ref(120);
let score = ref(0);
let countdown;
let guessedWords = reactive([])
let guessedFails = reactive([])
let newWord = ref("")
let showFinish = ref(false);
let possibleSolutions = reactive([])
let endMessage = ref("Time's up!");
let isModalVisible = ref(false);

function showModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

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

function minusHeart(amount) {
  hearts.value -= amount;
  if (hearts.value <= 0) {
    endGame("No lives left!");
  }
}

function submitWord() {
  const theWord = newWord.value.toLowerCase();
  if (!activeGame) return;
  if (theWord.length < 1) return;

  if (wordIsCorrect(theWord)) {
    addCorrectWord(theWord)
    newWord.value = "";
  } else {
    if (guessedFails.includes(theWord)) return;
    guessedFails.push(theWord);
    minusHeart(1);
    ;
  }
}

function countdownSecond() {
  timeLeft.value -= 1;
  if (timeLeft.value <= 0) {
    endGame("Time's up!");
  }
}

function resetGameState() {
  pauseGame();
  hearts.value = 5;
  timeLeft.value = 120;
  score.value = 0;
  guessedWords = reactive([]);
  guessedFails = reactive([]);
  possibleSolutions = reactive([]);
  showFinish.value = false;
  newWord.value = "";
}

function pauseGame() {
  clearInterval(countdown);
}

function startGame() {
  newGame();
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
  getAllSolutions();
}

function endGame(message) {
  console.log("ending game")
  console.log(message)
  pauseGame();
  endMessage.value = message
  activeGame.value = false;
  showFinish.value = true;
  nextTick();
}

function getAllSolutions() {
  for (let word of wordList) {
    if (wordIsCorrect(word)) possibleSolutions.push(word);
  }
}

async function setupGame() {
  await import(`/wordlist/english.txt?raw`)
    .then((a) => {
      wordList = a.default.split(";");
      newGame();
    })
}

onMounted(() => {
  setupGame();
})
</script>