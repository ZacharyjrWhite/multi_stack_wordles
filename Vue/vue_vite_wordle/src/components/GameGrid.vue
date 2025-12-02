<template>
  <div class="grid" id="grid">
    <div
      v-for="cell in cells"
      :key="`${cell.row}-${cell.col}`"
      :class="['cell', getCellClass(cell.row, cell.col)]"
    >
      {{ getCellLetter(cell.row, cell.col) }}
    </div>
    <WordleInput 
      :word="word" 
      :guesses="guesses" 
      :on-guess-submit="onGuessSubmit" 
      :has-won="hasWon" 
      :has-lost="hasLost" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import WordleInput from './WordleInput.vue';

const props = defineProps({
  word: {
    type: String,
    default: null
  },
  guesses: {
    type: Array,
    default: () => []
  },
  onGuessSubmit: {
    type: Function,
    required: true
  },
  hasWon: {
    type: Boolean,
    default: false
  },
  hasLost: {
    type: Boolean,
    default: false
  }
});

const rows = 6;
const cols = 5;

const cells = computed(() => {
  const result = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      result.push({ row, col });
    }
  }
  return result;
});

const getCellLetter = (rowIndex, colIndex) => {
  const guess = props.guesses[rowIndex];
  if (guess && guess.word[colIndex]) {
    return guess.word[colIndex];
  }
  return '';
};

const getCellClass = (rowIndex, colIndex) => {
  const guess = props.guesses[rowIndex];
  if (guess && guess.evaluation && guess.evaluation[colIndex]) {
    return guess.evaluation[colIndex];
  }
  return '';
};
</script>

<style scoped>
</style>
