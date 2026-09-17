<script lang="ts">
	interface Props {
		count?: number;
		progress?: number;
	}

	let { count = 4, progress = 0 }: Props = $props();

	const units = $derived(progress * (count - 1));
</script>

<div class="progress-bar" role="progressbar" aria-valuenow={Math.round(units) + 1} aria-valuemax={count}>
	{#each Array(count) as _, i}
		<div class="segment">
			<div class="fill" style="transform: scaleX({Math.min(1, Math.max(0, units - i + 1))})"></div>
		</div>
	{/each}
</div>

<style>
	.progress-bar {
		display: flex;
		gap: var(--sp-2);
		margin-top: var(--sp-5);
	}

	.segment {
		width: 32px;
		height: 3px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--text-primary) 18%, transparent);
		overflow: hidden;
	}

	.fill {
		width: 100%;
		height: 100%;
		background: var(--text-primary);
		transform-origin: left center;
		transform: scaleX(0);
		transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	@media (max-width: 560px) {
		.segment {
			width: 22px;
		}
	}
</style>
