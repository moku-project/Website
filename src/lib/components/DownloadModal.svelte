<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const REPO = 'moku-project/Moku';
	const RELEASES_URL = `https://github.com/${REPO}/releases/latest`;

	type Asset = { name: string; browser_download_url: string; size: number };
	type Platform = 'windows' | 'macos-arm64' | 'macos-x64' | 'linux-appimage' | 'linux-flatpak';
	type OS = 'windows' | 'macos' | 'linux';

	const PLATFORM_META: Record<Platform, { os: OS; label: string; detail: string; match: RegExp }> = {
		windows: { os: 'windows', label: 'Windows', detail: 'x64 installer (.exe)', match: /_x64-setup\.exe$/i },
		'macos-arm64': {
			os: 'macos',
			label: 'macOS',
			detail: 'Apple Silicon (.dmg)',
			match: /macos-arm64.*\.dmg$/i
		},
		'macos-x64': { os: 'macos', label: 'macOS', detail: 'Intel (.dmg)', match: /macos-x64.*\.dmg$/i },
		'linux-appimage': { os: 'linux', label: 'Linux', detail: 'AppImage', match: /\.AppImage$/i },
		'linux-flatpak': { os: 'linux', label: 'Linux', detail: 'Flatpak', match: /\.flatpak$/i }
	};

	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let version = $state('');
	let publishedAt = $state('');
	let assets = $state<Asset[]>([]);
	let detected = $state<Platform | null>(null);

	function detectPlatform(): Platform {
		const ua = navigator.userAgent;
		if (/Windows/i.test(ua)) return 'windows';
		if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux-appimage';
		if (/Macintosh|Mac OS X/i.test(ua)) return 'macos-arm64';
		return 'linux-appimage';
	}

	function assetFor(platform: Platform): Asset | undefined {
		return assets.find((a) => PLATFORM_META[platform].match.test(a.name));
	}

	function formatSize(bytes: number): string {
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function formatDate(iso: string): string {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	$effect(() => {
		if (!open || status !== 'loading') return;
		detected = detectPlatform();

		fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
			.then((res) => {
				if (!res.ok) throw new Error(`GitHub API ${res.status}`);
				return res.json();
			})
			.then((data) => {
				version = data.tag_name?.replace(/^v/, '') ?? '';
				publishedAt = data.published_at ?? '';
				assets = data.assets ?? [];
				status = 'ready';
			})
			.catch(() => {
				status = 'error';
			});
	});

	const orderedPlatforms: Platform[] = [
		'windows',
		'macos-arm64',
		'macos-x64',
		'linux-appimage',
		'linux-flatpak'
	];

	const primary = $derived(detected ? assetFor(detected) : undefined);
	const others = $derived(orderedPlatforms.filter((p) => p !== detected && assetFor(p)));
</script>

{#snippet osIcon(os: OS)}
	{#if os === 'macos'}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
			<path
				d="M16.36 12.66c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.44-2.51-1.63-3.06-1.66-1.31-.13-2.55.77-3.21.77-.67 0-1.68-.75-2.77-.73-1.42.02-2.74.83-3.47 2.1-1.48 2.57-.38 6.38 1.06 8.47.7 1.02 1.54 2.17 2.65 2.13 1.06-.04 1.46-.69 2.74-.69 1.28 0 1.64.69 2.76.66 1.14-.02 1.86-1.03 2.56-2.06a9.1 9.1 0 0 0 1.16-2.38c-.03-.01-2.21-.85-2.22-3.45ZM14.2 6.4c.59-.72 1-1.71.89-2.7-.85.03-1.9.57-2.51 1.28-.55.63-1.03 1.65-.9 2.62.94.08 1.9-.48 2.52-1.2Z"
			/>
		</svg>
	{:else if os === 'windows'}
		<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
			<path d="M3 5.6 10.4 4.6V11.4H3V5.6ZM11.4 4.5 21 3.2V11.3H11.4V4.5ZM3 12.4H10.4V19.3L3 18.3V12.4ZM11.4 12.4H21V20.7L11.4 19.4V12.4Z" />
		</svg>
	{:else}
		<svg viewBox="0 0 448 512" width="17" height="19" fill="currentColor" aria-hidden="true">
			<path
				d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"
			/>
		</svg>
	{/if}
{/snippet}

<Modal {open} {onclose} labelledby="download-title" width="500px">
	<div class="header">
		<img src="/moku-leaf.svg" alt="" class="logo" width="92" height="92" />
		<div class="header-copy">
			<h2 id="download-title">Download Moku</h2>
			<p class="meta">
				{#if status === 'ready'}
					Version {version} · {formatDate(publishedAt)} · free and open source
				{:else if status === 'error'}
					Free and open source
				{:else}
					Checking latest release…
				{/if}
			</p>
		</div>
	</div>

	{#if status === 'error'}
		<p class="intro">
			Couldn't reach GitHub to fetch the latest release. Grab it directly from
			<a href={RELEASES_URL} target="_blank" rel="noreferrer">the releases page</a>.
		</p>
	{:else if status === 'ready'}
		{#if primary && detected}
			<a href={primary.browser_download_url} class="primary-btn">
				<span class="primary-icon">{@render osIcon(PLATFORM_META[detected].os)}</span>
				<span class="primary-copy">
					<span class="primary-title">Download for {PLATFORM_META[detected].label}</span>
					<span class="primary-detail">{PLATFORM_META[detected].detail}</span>
				</span>
				<span class="primary-size">{formatSize(primary.size)}</span>
			</a>
		{:else}
			<p class="intro">No build detected for your platform yet — pick one below.</p>
		{/if}

		{#if others.length}
			<div class="alt-list">
				{#each others as p}
					{@const a = assetFor(p)}
					{#if a}
						<a href={a.browser_download_url} class="alt-link">
							<span class="alt-icon">{@render osIcon(PLATFORM_META[p].os)}</span>
							<span class="alt-copy">
								<span class="alt-title">{PLATFORM_META[p].label}</span>
								<span class="alt-detail">{PLATFORM_META[p].detail}</span>
							</span>
							<span class="alt-size">{formatSize(a.size)}</span>
						</a>
					{/if}
				{/each}
			</div>
		{/if}

		<a href={RELEASES_URL} target="_blank" rel="noreferrer" class="all-releases">
			See all releases on GitHub
		</a>
	{/if}
</Modal>

<style>
	.header {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
		margin-bottom: var(--sp-6);
	}

	.logo {
		flex-shrink: 0;
		width: 92px;
		height: 92px;
		padding: var(--sp-1);
		border-radius: var(--radius-xl);
		background: color-mix(in srgb, var(--text-primary) 6%, transparent);
		border: 1px solid color-mix(in srgb, var(--text-primary) 10%, transparent);
	}

	.header-copy {
		min-width: 0;
	}

	h2 {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.015em;
		color: var(--text-primary);
	}

	.meta {
		margin-top: 2px;
		font-size: 13.5px;
		color: var(--text-secondary);
	}

	.intro {
		font-size: 14.5px;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.intro a {
		color: var(--text-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.primary-btn {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
		width: 100%;
		padding: var(--sp-5);
		border-radius: var(--radius-lg);
		color: var(--bg-void);
		background: var(--text-primary);
		box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.5);
		transition: opacity 0.15s ease, transform 0.15s ease;
	}

	.primary-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.primary-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-lg);
		background: color-mix(in srgb, var(--bg-void) 10%, transparent);
	}

	.primary-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.primary-title {
		font-size: 15.5px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.primary-detail {
		font-size: 12.5px;
		font-weight: 500;
		opacity: 0.7;
	}

	.primary-size {
		margin-left: auto;
		flex-shrink: 0;
		font-size: 12.5px;
		font-weight: 600;
		opacity: 0.65;
	}

	.alt-list {
		display: flex;
		flex-direction: column;
		gap: var(--sp-1);
		margin-top: var(--sp-3);
		padding-top: var(--sp-3);
		border-top: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent);
	}

	.alt-link {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-2) var(--sp-2);
		border-radius: var(--radius-md);
		transition: background 0.15s ease;
	}

	.alt-link:hover {
		background: color-mix(in srgb, var(--text-primary) 6%, transparent);
	}

	.alt-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		color: var(--text-secondary);
	}

	.alt-copy {
		display: flex;
		align-items: baseline;
		gap: var(--sp-2);
		min-width: 0;
	}

	.alt-title {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.alt-detail {
		font-size: 12.5px;
		color: var(--text-secondary);
	}

	.alt-size {
		margin-left: auto;
		flex-shrink: 0;
		font-size: 12.5px;
		color: var(--text-secondary);
	}

	.all-releases {
		display: block;
		margin-top: var(--sp-5);
		font-size: 13px;
		color: var(--text-secondary);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.15s ease;
	}

	.all-releases:hover {
		color: var(--text-primary);
	}
</style>
