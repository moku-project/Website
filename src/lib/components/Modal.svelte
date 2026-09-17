<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		labelledby: string;
		width?: string;
		children: Snippet;
	}

	let { open, onclose, labelledby, width = '440px', children }: Props = $props();
</script>

{#if open}
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		aria-label="Close"
		onclick={onclose}
		onkeydown={(e) => e.key === 'Escape' && onclose()}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby={labelledby}
			tabindex="-1"
			style="--modal-width: {width}"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<button type="button" class="modal-close" aria-label="Close" onclick={onclose}>
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
					<path
						d="M6 6l12 12M18 6L6 18"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
			</button>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--sp-4);
		background: color-mix(in srgb, var(--bg-void) 70%, transparent);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}

	.modal {
		position: relative;
		width: min(var(--modal-width), 100%);
		padding: var(--sp-8);
		border-radius: var(--radius-2xl);
		border: 1px solid color-mix(in srgb, var(--text-primary) 12%, transparent);
		background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--text-primary) 4%, transparent),
			0 40px 100px rgba(0, 0, 0, 0.55);
	}

	.modal-close {
		position: absolute;
		top: var(--sp-5);
		right: var(--sp-5);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-lg);
		color: var(--text-secondary);
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		border: none;
		cursor: pointer;
		transition: color 0.15s ease, background 0.15s ease;
	}

	.modal-close:hover {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--text-primary) 14%, transparent);
	}
</style>
