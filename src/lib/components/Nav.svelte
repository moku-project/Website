<script lang="ts">
	import ExtensionsModal from '$lib/components/ExtensionsModal.svelte';
	import DownloadModal from '$lib/components/DownloadModal.svelte';

	const links = [
		{ href: 'https://discord.gg/x97hj8zR72', label: 'Community', external: true },
		{ label: 'Extensions', action: 'extensions' },
		{ href: '/docs', label: 'Docs' },
		{ href: 'https://github.com/moku-project/Moku', label: 'GitHub', external: true }
	];

	let extensionsOpen = $state(false);
	let downloadOpen = $state(false);
	let menuOpen = $state(false);

	function openExtensions() {
		menuOpen = false;
		extensionsOpen = true;
	}
</script>

<div class="nav-slot">
	<header class="nav">
		<a href="/" class="brand">
			<img src="/moku-leaf.svg" alt="" class="brand-mark" width="58" height="58" />
			<span>Moku</span>
		</a>

		<nav class="links" aria-label="Primary">
			{#each links as link}
				{#if link.action === 'extensions'}
					<button type="button" class="link-btn" onclick={() => (extensionsOpen = true)}>
						{link.label}
					</button>
				{:else}
					<a
						href={link.href}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}>{link.label}</a
					>
				{/if}
			{/each}
		</nav>

		<div class="actions">
			<button type="button" class="solid-btn" onclick={() => (downloadOpen = true)}>
				<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
					<path
						d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1ZM5 19a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H5Z"
					/>
				</svg>
				Download
			</button>

			<button
				type="button"
				class="menu-btn"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
					{#if menuOpen}
						<path
							d="M6 6l12 12M18 6L6 18"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						/>
					{:else}
						<path
							d="M4 7h16M4 12h16M4 17h16"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						/>
					{/if}
				</svg>
			</button>
		</div>

		{#if menuOpen}
			<nav class="mobile-links" aria-label="Primary mobile">
				{#each links as link}
					{#if link.action === 'extensions'}
						<button type="button" class="link-btn" onclick={openExtensions}>
							{link.label}
						</button>
					{:else}
						<a
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noreferrer' : undefined}
							onclick={() => (menuOpen = false)}>{link.label}</a
						>
					{/if}
				{/each}
			</nav>
		{/if}
	</header>
</div>

<ExtensionsModal open={extensionsOpen} onclose={() => (extensionsOpen = false)} />
<DownloadModal open={downloadOpen} onclose={() => (downloadOpen = false)} />

<style>
	.nav-slot {
		position: sticky;
		top: var(--sp-6);
		z-index: 40;
		width: 100%;
		padding: var(--sp-5) var(--sp-4) 0;
	}

	.nav {
		position: relative;
		width: 100%;
		max-width: 1344px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-8);
		padding: var(--sp-4) var(--sp-8);
		border-radius: var(--radius-2xl);
		border: 1px solid var(--border-base);
		background: color-mix(in srgb, var(--bg-surface) 78%, transparent);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		box-shadow: 0 0 0 1px var(--border-dim), 0 16px 40px rgba(0, 0, 0, 0.5);
	}

	.brand-mark {
		transform: rotate(-15deg);
		margin-left: -8px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.015em;
		font-feature-settings: 'ss01' on, 'cv05' on;
		font-optical-sizing: auto;
		flex-shrink: 0;
	}

	.links {
		display: flex;
		align-items: center;
		gap: var(--sp-6);
		margin-left: var(--sp-4);
	}

	.links a {
		font-size: 16px;
		font-weight: 500;
		letter-spacing: -0.005em;
		color: var(--text-secondary);
		transition: color 0.15s ease;
	}

	.links a:hover {
		color: var(--text-primary);
	}

	.link-btn {
		font: inherit;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: -0.005em;
		color: var(--text-secondary);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color 0.15s ease;
	}

	.link-btn:hover {
		color: var(--text-primary);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--sp-5);
		margin-left: auto;
		flex-shrink: 0;
	}

	.solid-btn {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 15.5px;
		font-weight: 600;
		color: var(--bg-void);
		background: var(--text-primary);
		padding: var(--sp-3) var(--sp-6);
		border-radius: var(--radius-lg);
		border: none;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.solid-btn:hover {
		opacity: 0.88;
	}

	.menu-btn {
		display: none;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-base);
		background: none;
		color: var(--text-primary);
		cursor: pointer;
		flex-shrink: 0;
	}

	.mobile-links {
		display: none;
	}

	@media (max-width: 720px) {
		.links {
			display: none;
		}

		.menu-btn {
			display: flex;
		}

		.nav {
			padding: var(--sp-4) var(--sp-5);
			gap: var(--sp-4);
		}

		.actions {
			gap: var(--sp-3);
		}

		.solid-btn {
			padding: var(--sp-3) var(--sp-4);
			font-size: 14px;
		}

		.mobile-links {
			display: flex;
			flex-direction: column;
			gap: var(--sp-1);
			width: 100%;
			margin-top: var(--sp-3);
			padding-top: var(--sp-4);
			border-top: 1px solid var(--border-dim);
		}

		.mobile-links a,
		.mobile-links .link-btn {
			padding: var(--sp-3) var(--sp-2);
			font-size: 16px;
			font-weight: 500;
			text-align: left;
			color: var(--text-secondary);
		}
	}
</style>
