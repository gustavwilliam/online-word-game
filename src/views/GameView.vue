<template>
  <TheScoreboard :hearts="hearts" :timeLeft="timeLeft" :score="score"></TheScoreboard>
  <ThePadding>
    <NavigationGroup>
      <NavigationButton :icon="ChevronLeftIcon" to="/">Exit to main menu</NavigationButton>
      <NavigationButton :icon="ArrowPathIcon" :onclick="newLetter" v-if="activeGame || showFinish">New word
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
        <div class="mt-8 flex w-full gap-2">
          <WordsFoundBox title="Found"><span class="text-4xl">{{ score }}</span></WordsFoundBox>
          <WordsFoundBox title="Possible"><span class="text-4xl">{{ possibleSolutions.length }}</span>
          </WordsFoundBox>
          <!-- <div class="bg-white grow uppercase">
                Show solutions
              </div> -->
        </div>
        <button :onclick="startGame" class="bg-orange-500 w-full py-3 rounded-lg mt-4 text-lg text-white">
          Play again
        </button>
      </div>
      <div v-else class="w-full h-full mb-7">
        <h1 class="text-4xl mb-4">Word Game</h1>
        <p>When you start the game, you'll be given a random word. Make as many words with the letters of the word as
          possible, before the time runs out! And be careful — make too many mistakes and you lose.</p>
        <button :onclick="startGame" class="bg-orange-500 w-full py-3 rounded-lg mt-4 text-lg text-white">
          Start game
        </button>
      </div>
    </div>
  </ThePadding>
</template>

<script setup>
import TheScoreboard from '../components/TheScoreboard.vue';
import ThePadding from '../components/ThePadding.vue';
import WordsFoundBox from '../components/WordsFoundBox.vue'
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
let guessedFails = reactive([])
let newWord = ref("")
let showFinish = ref(false);
let possibleSolutions = reactive([])
let endMessage = ref("Time's up!");

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
  if (timeLeft <= 0) {
    endGame("Time's up!");
  }
}

function resetGameState() {
  hearts.value = 5;
  timeLeft.value = 45;
  score.value = 0;
  guessedWords = reactive([]);
  guessedFails = reactive([]);
  possibleSolutions = reactive([]);
  newWord.value = "";
}

function pauseGame() {
  clearInterval(countdown);
}

function startGame() {
  console.log("Starting game.");
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
  endMessage.value = message
  pauseGame();
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
  setupGame()
})
</script>