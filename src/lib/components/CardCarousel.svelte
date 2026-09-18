<script lang="ts">
	import { FEATURE_CARDS, type FeatureCard } from '$lib/data/features';

	interface Props {
		count?: number;
		index?: number;
		cards?: FeatureCard[];
	}

	let { count = 5, index = 0, cards = FEATURE_CARDS }: Props = $props();

	const COLS = 18;
	const ROWS = 10;
	const TILE_MS = 170;
	const COL_STEP = 6;
	const ROW_JITTER = 2;
	const GAP_MS = 40;
	const GRID_FADE_MS = 140;

	const SEGMENT_MS = (COLS - 1) * COL_STEP + (ROWS - 1) * ROW_JITTER + TILE_MS;
	const TOTAL_MS = SEGMENT_MS + GAP_MS + SEGMENT_MS;

	let segmented = $state(false);
	let gridVisible = $state(false);
	let tilesActive = $state(false);
	let displayIndex = $state(0);
	let lastIndex: number | null = null;

	const tiles = Array.from({ length: COLS * ROWS }, (_, i) => {
		const col = i % COLS;
		const row = Math.floor(i / COLS);
		return { i, col, row, delay: col * COL_STEP + row * ROW_JITTER };
	});

	$effect(() => {
		const target = index;
		if (lastIndex === null) {
			lastIndex = target;
			displayIndex = target;
			return;
		}
		if (target === lastIndex) return;
		lastIndex = target;

		tilesActive = true;
		segmented = false;
		gridVisible = false;

		let raf1 = 0,
			raf2 = 0;
		raf1 = requestAnimationFrame(() => {
			gridVisible = true;
			raf2 = requestAnimationFrame(() => {
				segmented = true;
			});
		});

		const tSwap = setTimeout(() => {
			displayIndex = target;
		}, SEGMENT_MS / 2);

		const t1 = setTimeout(() => {
			segmented = false;
		}, SEGMENT_MS + GAP_MS);

		const t2 = setTimeout(() => {
			gridVisible = false;
		}, TOTAL_MS - GRID_FADE_MS);

		const t3 = setTimeout(() => {
			tilesActive = false;
		}, TOTAL_MS);

		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
			clearTimeout(tSwap);
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	});

	const cardHidden = $derived(tilesActive);
	const content = $derived(cards[displayIndex] ?? cards[0]);
</script>

<div class="stage-card">
	<div class="clip-bleed">
		<div class="glass-card" class:hidden={cardHidden}>
			{#if content.image}
				<img class="card-img" src={content.image} alt="" loading="lazy" />
			{/if}
		</div>

		{#if tilesActive}
			<div class="tile-grid" class:visible={gridVisible} style="--cols: {COLS}; --rows: {ROWS}">
				{#each tiles as t (t.i)}
					<div
						class="tile"
						class:segmented
						style="
							left:{(t.col / COLS) * 100}%; top:{(t.row / ROWS) * 100}%;
							width:{100 / COLS}%; height:{100 / ROWS}%;
							transition-delay:{t.delay}ms;
						"
					></div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.stage-card {
		position: relative;
		width: min(1650px, 88vw);
		height: auto;
		max-height: 100%;
		aspect-ratio: 16 / 10;
	}

	.clip-bleed {
		position: absolute;
		inset: -22px;
		border-radius: 37px;
		overflow: hidden;
	}

	.glass-card {
		position: absolute;
		inset: 22px;
		display: flex;
		padding: 35px 35px 0;
		border-radius: 15px;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
		background: color-mix(in srgb, var(--bg-surface) 28%, transparent);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--text-primary) 4%, transparent),
			0 40px 100px rgba(0, 0, 0, 0.55);
		opacity: 1;
		transition: opacity 200ms ease;
	}

	.glass-card.hidden {
		opacity: 0;
	}

	.card-img {
		width: 100%;
		height: 100%;
		border-radius: 9px 9px 0 0;
		border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
		border-bottom: none;
		object-fit: cover;
		object-position: top;
		display: block;
	}

	.tile-grid {
		position: absolute;
		inset: 22px;
		border-radius: 15px;
		overflow: visible;
		backdrop-filter: blur(18px) saturate(1.3);
		-webkit-backdrop-filter: blur(18px) saturate(1.3);
		opacity: 0;
		transition: opacity 140ms ease;
	}

	.tile-grid.visible {
		opacity: 1;
	}

	.tile {
		position: absolute;
		border-radius: 3px;
		background: color-mix(in srgb, var(--bg-surface) 34%, transparent);
		border: 1px solid color-mix(in srgb, var(--text-primary) 16%, transparent);
		transform: scale(1);
		transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	.tile.segmented {
		transform: scale(0.72);
	}
</style>
