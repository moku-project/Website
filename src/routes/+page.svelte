<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
</script>

<svelte:head>
	<title>Moku — Fast, minimal reader</title>
	<meta
		name="description"
		content="Moku is a lightweight manga, novel, and anime reader for your own Tsunagu server, with extension support and no Electron overhead."
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
