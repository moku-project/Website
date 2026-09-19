<script lang="ts">
	import CardRain from '$lib/components/CardRain.svelte';
	import CardCarousel from '$lib/components/CardCarousel.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { FEATURE_CARDS } from '$lib/data/features';

	const CARD_COUNT = FEATURE_CARDS.length;
	const LOCK_MS = 700;
	const HEADING_FADE_MS = 180;

	let index = $state(0);
	let headingIndex = $state(0);
	let headingFading = $state(false);
	let locked = false;

	function step(d: number) {
		if (locked) return;
		const next = (index + d + CARD_COUNT) % CARD_COUNT;
		if (next === index) return;
		index = next;
		locked = true;
		headingFading = true;
		setTimeout(() => {
			headingIndex = next;
			headingFading = false;
		}, HEADING_FADE_MS);
		setTimeout(() => (locked = false), LOCK_MS);
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		if (locked) return;
		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
		step(delta > 0 ? 1 : -1);
	}

	let touchStartX = 0;
	let touchStartY = 0;

	function onTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function onTouchEnd(e: TouchEvent) {
		if (locked) return;
		const dx = touchStartX - e.changedTouches[0].clientX;
		const dy = touchStartY - e.changedTouches[0].clientY;
		if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
		step((Math.abs(dx) > Math.abs(dy) ? dx : dy) > 0 ? 1 : -1);
	}

	const progress = $derived(index / (CARD_COUNT - 1));
	const current = $derived(FEATURE_CARDS[headingIndex]);

	let cardAreaHeight = $state(620);
</script>

<svelte:body onwheel={onWheel} ontouchstart={onTouchStart} ontouchend={onTouchEnd} />

<section class="hero">
	<CardRain />
	<div class="stage">
		<div class="group">
			<div class="heading" class:fading={headingFading}>
				<h1>{current.title}</h1>
				<p class="sub">{current.description}</p>
			</div>
			<div class="card-area" bind:clientHeight={cardAreaHeight} style="--card-area-h: {cardAreaHeight}px">
				<CardCarousel count={CARD_COUNT} {index} />
			</div>
			<ProgressBar count={CARD_COUNT} {progress} />
		</div>
	</div>
</section>

<style>
	.hero {
		position: fixed;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100svh;
		overflow: hidden;
		overscroll-behavior-x: none;
	}

	.stage {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(269px, 29.9vh, 359px) var(--sp-4) clamp(40px, 8vh, 90px);
	}

	.group {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.card-area {
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.heading {
		flex-shrink: 0;
		text-align: center;
		margin-bottom: clamp(13px, 3.4vh, 36px);
		opacity: 1;
		transition: opacity 180ms ease;
	}

	.heading.fading {
		opacity: 0;
	}

	.heading h1 {
		font-size: clamp(22px, 2.2vw, 28px);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--text-primary);
		text-shadow: 0 0 24px color-mix(in srgb, var(--leaf-mid) 45%, transparent);
	}

	.sub {
		margin-top: var(--sp-2);
		font-size: 15px;
		color: var(--text-secondary);
	}

	@media (max-width: 640px) {
		.stage {
			padding: 90px var(--sp-3) 100px;
		}

		.heading {
			margin-bottom: var(--sp-8);
		}

		.heading h1 {
			font-size: clamp(19px, 5.5vw, 24px);
		}

		.sub {
			font-size: 13.5px;
		}
	}
</style>
