<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import MobileHero from '$lib/components/MobileHero.svelte';

	const MOBILE_QUERY = '(max-width: 720px)';
	let isMobile = $state(false);

	$effect(() => {
		const mq = window.matchMedia(MOBILE_QUERY);
		const update = () => (isMobile = mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	});
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

		@media (max-width: 720px) {
			html,
			body {
				height: auto;
				overflow-y: auto;
			}
		}
	</style>
</svelte:head>

<Nav />
{#if isMobile}
	<MobileHero />
{:else}
	<Hero />
{/if}
