<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
</script>

<svelte:head>
	<title>Moku — Fast, minimal reader</title>
	<meta
		name="description"
		content="Moku is a standalone manga, novel, and anime reader with extension support and no Electron overhead — install it and start reading."
	/>
	<style>
		html,
		body {
			height: 100%;
			overflow: hidden;
			overscroll-behavior-x: none;
		}
	</style>
</svelte:head>

<Nav />
<Hero />
