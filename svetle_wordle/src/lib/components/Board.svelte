<script>
  import GameGrid from "./GameGrid.svelte";
  import { onMount } from 'svelte';
  import wordList from '../assets/word_list.json';

  let word = $state(null);
  let guesses = $state([]);
  let hasWon = $state(false);
  let hasLost = $state(false);
  let hasFetched = $state(false);

  const fetchWord = async () => {
    try {
      const selectedWord = wordList.words[Math.floor(Math.random() * wordList.words.length)];
      console.log("Selected word:", selectedWord);
      word = selectedWord;
      hasFetched = true;
    } catch (error) {
      console.error('Error fetching word list:', error);
    }
  };

  const evaluateGuess = (guessWord, targetWord) => {
    const evaluation = [];
    const targetLetters = targetWord.toUpperCase().split("");
    const guessLetters = guessWord.toUpperCase().split("");
    const usedIndices = new Set();

    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        evaluation[i] = "correct";
        usedIndices.add(i);
      }
    }

    for (let i = 0; i < guessLetters.length; i++) {
      if (evaluation[i] === "correct") continue;

      for (let j = 0; j < targetLetters.length; j++) {
        if (!usedIndices.has(j) && guessLetters[i] === targetLetters[j]) {
          evaluation[i] = "present";
          usedIndices.add(j);
          break;
        }
      }

      if (!evaluation[i]) {
        evaluation[i] = "absent";
      }
    }

    return evaluation;
  };

  const handleGuessSubmit = (guessWord) => {
    if (!word || guesses.length >= 6 || hasWon || hasLost) return;

    const evaluation = evaluateGuess(guessWord, word);
    const newGuess = {
      word: guessWord.toUpperCase(),
      evaluation: evaluation,
    };

    const updatedGuesses = [...guesses, newGuess];
    guesses = updatedGuesses;

    if (evaluation.every((status) => status === "correct")) {
      hasWon = true;
    } else if (updatedGuesses.length >= 6) {
      hasLost = true;
    }
  };

  const handleRestart = () => {
    guesses = [];
    hasWon = false;
    hasLost = false;
    hasFetched = false;
    fetchWord();
  };

  onMount(() => {
    if (!hasFetched) {
      fetchWord();
    }
  });
</script>

<GameGrid
  {word}
  {guesses}
  onGuessSubmit={handleGuessSubmit}
  {hasWon}
  {hasLost}
/>

{#if hasWon}
  <div class="win-popup-overlay">
    <div class="win-popup">
      <h2>🎉 You Won!</h2>
      <p>Congratulations! You guessed the word correctly.</p>
      <button class="restart-button" onclick={handleRestart}>
        Play Again
      </button>
    </div>
  </div>
{/if}

{#if hasLost}
  <div class="win-popup-overlay">
    <div class="lose-popup">
      <h2>😔 You Lost!</h2>
      <p>The word was: <strong>{word?.toUpperCase()}</strong></p>
      <button class="restart-button lose-restart-button" onclick={handleRestart}>
        Play Again
      </button>
    </div>
  </div>
{/if}
