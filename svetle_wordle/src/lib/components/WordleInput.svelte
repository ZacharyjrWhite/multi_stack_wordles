<script>
    import { onMount } from 'svelte';
    
    let { word, guesses, onGuessSubmit, hasWon, hasLost } = $props();
    let inputWord = $state('');
    let inputElement = $state(null);

    onMount(() => {
        if (inputElement) {
            inputElement.focus();
        }
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputWord.trim() !== '') {
            if (!word || inputWord.length !== 5 || guesses.length >= 6 || hasWon || hasLost) {
                return;
            }

            onGuessSubmit(inputWord);
            inputWord = '';
        }
    };

    const handleBlur = () => {
        // Used to keep the input focused when the user clicks outside of it
        setTimeout(() => {
            if (inputElement) {
                inputElement.focus();
            }
        }, 0);
    };

    const handleInput = (e) => {
        if (hasWon || hasLost) return;
        const value = e.target.value.toUpperCase().slice(0, 5);
        inputWord = value;
    };
</script>

<input 
    bind:this={inputElement}
    class="wordle-input" 
    type="text" 
    placeholder="Enter a 5 letter word" 
    value={inputWord} 
    oninput={handleInput}
    onkeydown={handleKeyDown}
    onblur={handleBlur}
    disabled={hasWon || hasLost}
    autofocus
/>

