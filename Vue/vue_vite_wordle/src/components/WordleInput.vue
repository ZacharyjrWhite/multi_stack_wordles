<template>
  <input
    ref="inputRef"
    class="wordle-input"
    type="text"
    placeholder="Enter a 5 letter word"
    :value="inputWord"
    @input="handleInput"
    @keydown="handleKeyDown"
    @blur="handleBlur"
    :disabled="hasWon || hasLost"
    autofocus
  />
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

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

const inputWord = ref('');
const inputRef = ref(null);

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

onMounted(() => {
  focusInput();
});

watch([() => props.hasWon, () => props.hasLost], () => {
  nextTick(() => {
    focusInput();
  });
});

const handleInput = (e) => {
  if (props.hasWon || props.hasLost) return;
  const value = e.target.value.toUpperCase().slice(0, 5);
  inputWord.value = value;
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && inputWord.value.trim() !== '') {
    if (!props.word || inputWord.value.length !== 5 || props.guesses.length >= 6 || props.hasWon || props.hasLost) {
      return;
    }

    props.onGuessSubmit(inputWord.value);
    inputWord.value = '';
  }
};

const handleBlur = () => {
  // Used to keep the input focused when the user clicks outside of it
  setTimeout(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  }, 0);
};
</script>

<style scoped>
</style>
