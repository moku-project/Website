<script lang="ts">
	import DownloadModal from '$lib/components/DownloadModal.svelte';

	let downloadOpen = $state(false);
</script>

<section class="mobile-hero">
	<img src="/moku-icon.svg" alt="" class="icon" width="72" height="72" />

	<h1>Moku</h1>
	<p class="tagline">A fast, minimal reader. Zero setup.</p>
	<p class="desc">
		Standalone manga, novel, and anime reading — with extension support and no Electron overhead.
	</p>

	<button type="button" class="download-btn" onclick={() => (downloadOpen = true)}>
		<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
			<path
				d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1ZM5 19a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H5Z"
			/>
		</svg>
		Download
	</button>
</section>

<DownloadModal open={downloadOpen} onclose={() => (downloadOpen = false)} />

<style>
	.mobile-hero {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 100%;
		min-height: 100svh;
		padding: 140px 28px 64px;
		overflow: hidden;
	}

	.icon {
		position: relative;
		margin-bottom: 20px;
		filter: drop-shadow(0 0 24px color-mix(in srgb, var(--leaf-mid) 45%, transparent));
	}

	h1 {
		position: relative;
		font-size: 34px;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}

	.tagline {
		position: relative;
		margin-top: 10px;
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.desc {
		position: relative;
		margin-top: 12px;
		max-width: 340px;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.download-btn {
		position: relative;
		display: flex;
		align-items: center;
		gap: 9px;
		margin-top: 32px;
		padding: 15px 26px;
		border-radius: 10px;
		border: none;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--bg-void);
		background: var(--text-primary);
		cursor: pointer;
		box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.5);
	}

	.download-btn:active {
		opacity: 0.85;
	}
</style>
