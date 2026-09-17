<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const sources = [
		{
			name: 'Mihon',
			icon: 'https://github.com/mihonapp.png',
			href: 'https://github.com/mihonapp/mihon',
			blurb: 'Manga reader — Tachiyomi’s spiritual successor. Extension format is compatible.'
		},
		{
			name: 'Aniyomi',
			icon: 'https://github.com/aniyomiorg.png',
			href: 'https://github.com/aniyomiorg/aniyomi',
			blurb: 'Anime & manga reader forked from Tachiyomi, adds video sources.'
		},
		{
			name: 'LNReader',
			icon: 'https://github.com/LNReader.png',
			href: 'https://github.com/LNReader/lnreader',
			blurb: 'Light novel reader with its own plugin ecosystem.'
		}
	];

	const AUTOPLAY_MS = 3600;
	let index = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	function go(next: number) {
		index = (next + sources.length) % sources.length;
		restart();
	}

	function restart() {
		clearInterval(timer);
		timer = setInterval(() => {
			index = (index + 1) % sources.length;
		}, AUTOPLAY_MS);
	}

	$effect(() => {
		if (open) {
			index = 0;
			restart();
		} else {
			clearInterval(timer);
		}
		return () => clearInterval(timer);
	});
</script>

<Modal {open} {onclose} labelledby="extensions-title" width="620px">
	<h2 id="extensions-title">Extensions</h2>
	<p class="intro">
		Moku installs and manages source extensions directly from the app, compatible with these
		three ecosystems:
	</p>

	<div class="carousel">
		<button type="button" class="nav-btn prev" aria-label="Previous" onclick={() => go(index - 1)}>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
				<path
					d="M15 6l-6 6 6 6"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		<div class="track">
			{#each sources as s, i (s.name)}
				<a
					href={s.href}
					target="_blank"
					rel="noreferrer"
					class="source"
					class:active={i === index}
					aria-hidden={i !== index}
					tabindex={i === index ? 0 : -1}
				>
					<img src={s.icon} alt="" class="source-icon" width="56" height="56" loading="lazy" />
					<span class="source-name">
						{s.name}
						<svg
							viewBox="0 0 24 24"
							width="14"
							height="14"
							fill="none"
							class="source-arrow"
							aria-hidden="true"
						>
							<path
								d="M7 17L17 7M17 7H9M17 7V15"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
					<span class="source-blurb">{s.blurb}</span>
				</a>
			{/each}
		</div>

		<button type="button" class="nav-btn next" aria-label="Next" onclick={() => go(index + 1)}>
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
				<path
					d="M9 6l6 6-6 6"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>

	<div class="dots">
		{#each sources as s, i (s.name)}
			<button
				type="button"
				class="dot"
				class:active={i === index}
				aria-label={`Show ${s.name}`}
				onclick={() => go(i)}
			></button>
		{/each}
	</div>
</Modal>

<style>
	h2 {
		font-size: 21px;
		font-weight: 700;
		letter-spacing: -0.015em;
		color: var(--text-primary);
		margin-bottom: var(--sp-2);
	}

	.intro {
		font-size: 15px;
		line-height: 1.55;
		color: var(--text-secondary);
		margin-bottom: var(--sp-6);
	}

	.carousel {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.nav-btn {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 999px;
		color: var(--text-secondary);
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		border: none;
		cursor: pointer;
		transition: color 0.15s ease, background 0.15s ease;
	}

	.nav-btn:hover {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--text-primary) 14%, transparent);
	}

	.track {
		position: relative;
		flex: 1;
		height: 220px;
	}

	.source {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: var(--sp-3);
		padding: var(--sp-6);
		border-radius: var(--radius-2xl);
		border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
		background: color-mix(in srgb, var(--text-primary) 4%, transparent);
		opacity: 0;
		transform: scale(0.96);
		pointer-events: none;
		transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
			background 0.15s ease, border-color 0.15s ease;
	}

	.source.active {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.source:hover {
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		border-color: color-mix(in srgb, var(--text-primary) 18%, transparent);
	}

	.source-icon {
		border-radius: var(--radius-lg);
	}

	.source-name {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 18px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--text-primary);
	}

	.source-arrow {
		color: var(--text-secondary);
	}

	.source-blurb {
		max-width: 34ch;
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.dots {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
		margin-top: var(--sp-5);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-primary) 22%, transparent);
		border: none;
		cursor: pointer;
		padding: 0;
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.dot.active {
		background: var(--text-primary);
		transform: scale(1.3);
	}
</style>
