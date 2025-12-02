<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../lib/assets/App.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Svelte Wordle</title>
</svelte:head>

{@render children()}
