<script>
    import WordleInput from './WordleInput.svelte';
    
    let { word, guesses, onGuessSubmit, hasWon, hasLost } = $props();

    const rows = 6;
    const cols = 5;
</script>

<div class="grid" id="grid">
    {#each Array(rows) as _, rowIndex}
        {#each Array(cols) as _, colIndex}
            {@const guess = guesses[rowIndex]}
            {#if guess && guess.word[colIndex]}
                {@const letter = guess.word[colIndex]}
                {@const evaluation = guess.evaluation[colIndex]}
                <div class="cell {evaluation}">{letter}</div>
            {:else}
                <div class="cell"></div>
            {/if}
        {/each}
    {/each}
    <WordleInput {word} {guesses} {onGuessSubmit} {hasWon} {hasLost} />
</div>