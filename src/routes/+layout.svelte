<script lang="ts">
	import '$lib/styles/global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/moku-icon.svg" />
</svelte:head>

{@render children()}
