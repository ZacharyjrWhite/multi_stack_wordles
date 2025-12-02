<template>
  <div>
    <GameGrid 
      :word="word" 
      :guesses="guesses" 
      :on-guess-submit="handleGuessSubmit" 
      :has-won="hasWon" 
      :has-lost="hasLost" 
    />
    <div v-if="hasWon" class="win-popup-overlay">
      <div class="win-popup">
        <h2>🎉 You Won!</h2>
        <p>Congratulations! You guessed the word correctly.</p>
        <button class="restart-button" @click="handleRestart">
          Play Again
        </button>
      </div>
    </div>
    <div v-if="hasLost" class="win-popup-overlay">
      <div class="lose-popup">
        <h2>😔 You Lost!</h2>
        <p>The word was: <strong>{{ word?.toUpperCase() }}</strong></p>
        <button class="restart-button lose-restart-button" @click="handleRestart">
          Play Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GameGrid from './GameGrid.vue';

const word = ref(null);
const guesses = ref([]);
const hasWon = ref(false);
const hasLost = ref(false);
const hasFetched = ref(false);

const fetchWord = async () => {
  try {
    const response = await fetch("./src/assets/word_list.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const selectedWord = result.words[Math.floor(Math.random() * result.words.length)];
    console.log('Selected word:', selectedWord);
    word.value = selectedWord;
  } catch (error) {
    console.error('Error fetching word list:', error);
  }
};

onMounted(() => {
  if (hasFetched.value) return;
  hasFetched.value = true;
  fetchWord();
});

const evaluateGuess = (guessWord, targetWord) => {
  const evaluation = [];
  const targetLetters = targetWord.toUpperCase().split('');
  const guessLetters = guessWord.toUpperCase().split('');
  const usedIndices = new Set();

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      evaluation[i] = 'correct';
      usedIndices.add(i);
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (evaluation[i] === 'correct') continue;
    
    for (let j = 0; j < targetLetters.length; j++) {
      if (!usedIndices.has(j) && guessLetters[i] === targetLetters[j]) {
        evaluation[i] = 'present';
        usedIndices.add(j);
        break;
      }
    }
    
    if (!evaluation[i]) {
      evaluation[i] = 'absent';
    }
  }

  return evaluation;
};

const handleGuessSubmit = (guessWord) => {
  if (!word.value || guesses.value.length >= 6 || hasWon.value || hasLost.value) return;
  
  const evaluation = evaluateGuess(guessWord, word.value);
  const newGuess = {
    word: guessWord.toUpperCase(),
    evaluation: evaluation
  };
  
  const updatedGuesses = [...guesses.value, newGuess];
  guesses.value = updatedGuesses;
  
  if (evaluation.every(status => status === 'correct')) {
    hasWon.value = true;
  } else if (updatedGuesses.length >= 6) {
    hasLost.value = true;
  }
};

const handleRestart = () => {
  guesses.value = [];
  hasWon.value = false;
  hasLost.value = false;
  hasFetched.value = false;
  fetchWord();
};
</script>

<style scoped>
</style>
