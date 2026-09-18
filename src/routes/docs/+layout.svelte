<script lang="ts">
	import { page } from '$app/state';
	import { DOC_PAGES, DOC_GROUPS, docHref, type DocPage } from '$lib/data/docs';

	let { children } = $props();

	let query = $state('');

	const filtered = $derived(
		query.trim()
			? DOC_PAGES.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()))
			: DOC_PAGES
	);

	function groupPages(group: string): DocPage[] {
		return filtered.filter((p) => p.group === group);
	}

	const current = $derived(page.data.page as DocPage | undefined);
	const toc = $derived(current?.blocks.filter((b) => b.type === 'h2') ?? []);
	const currentIndex = $derived(current ? DOC_PAGES.findIndex((p) => p.slug === current.slug) : -1);
	const prevPage = $derived(currentIndex > 0 ? DOC_PAGES[currentIndex - 1] : undefined);
	const nextPage = $derived(
		currentIndex >= 0 && currentIndex < DOC_PAGES.length - 1 ? DOC_PAGES[currentIndex + 1] : undefined
	);

	function isActive(slug: string): boolean {
		return current?.slug === slug;
	}

	let copied = $state(false);

	function copyPage() {
		if (!current) return;
		const text = current.blocks
			.map((b) => {
				if (b.type === 'h2') return `## ${b.text}`;
				if (b.type === 'p' || b.type === 'note') return b.text.replace(/\*\*|`|\[|\]\([^)]*\)/g, '');
				if (b.type === 'ul') return b.items.map((i) => `- ${i.replace(/\*\*|`/g, '')}`).join('\n');
				if (b.type === 'code') return b.code;
				if (b.type === 'table') return b.rows.map(([k, v]) => `${k}: ${v.replace(/`/g, '')}`).join('\n');
				return '';
			})
			.join('\n\n');
		navigator.clipboard.writeText(`# ${current.title}\n\n${text}`);
		copied = true;
		setTimeout(() => (copied = false), 1800);
	}
</script>

{#snippet groupIcon(group: string)}
	{#if group === 'Getting Started'}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
			<path
				d="M5 3v18M5 4h11l-2 4 2 4H5"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if group === 'Features'}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
			<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
		</svg>
	{:else if group === 'Customization'}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
			<line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<circle cx="9" cy="6" r="1.6" fill="currentColor" />
			<line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<circle cx="15" cy="12" r="1.6" fill="currentColor" />
			<line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<circle cx="7" cy="18" r="1.6" fill="currentColor" />
		</svg>
	{:else if group === 'Architecture'}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
			<path
				d="M12 3 2 8l10 5 10-5-10-5Z"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="m2 13 10 5 10-5"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if group === 'Community'}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
			<path
				d="M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3 2.7-5 6-5s6 2 6 5M14 20c.3-2.5 2.3-4 5-4s4.7 1.5 5 4"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
			<path
				d="M4 4h16v6H4V4Zm0 10h16v6H4v-6Zm3.5-7h.01M7.5 17h.01"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
{/snippet}

<svelte:head>
	<title>{current ? `${current.title} — Moku Docs` : 'Moku Docs'}</title>
</svelte:head>

<div class="docs-shell">
	<aside class="sidebar">
		<div class="sidebar-inner">
			<a href="/" class="brand">
				<img src="/moku-leaf.svg" alt="" width="33" height="33" />
				<span>Moku <span class="brand-dim">Docs</span></span>
			</a>

			<label class="search">
				<svg viewBox="0 0 24 24" width="21" height="21" fill="none" class="search-icon" aria-hidden="true">
					<circle cx="10.5" cy="10.5" r="7" stroke="currentColor" stroke-width="1.8" />
					<line
						x1="20"
						y1="20"
						x2="15.8"
						y2="15.8"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>
				</svg>
				<input type="text" placeholder="Search docs" bind:value={query} />
			</label>

			<nav aria-label="Docs sections">
				{#each DOC_GROUPS as group}
					{@const pages = groupPages(group)}
					{#if pages.length}
						<div class="group">
							<span class="group-title">
								{@render groupIcon(group)}
								{group}
							</span>
							<ul>
								{#each pages as p}
									<li>
										<a href={docHref(p.slug)} class:active={isActive(p.slug)}>{p.title}</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</nav>

			<a href="/" class="back-link">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
					<path
						d="M15 6l-6 6 6 6"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Back to moku.app
			</a>

			<div class="social-row">
				<a href="https://github.com/moku-project/Moku" target="_blank" rel="noreferrer" aria-label="GitHub">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
						<path
							d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z"
						/>
					</svg>
				</a>
				<a href="https://discord.gg/x97hj8zR72" target="_blank" rel="noreferrer" aria-label="Discord">
					<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
						<path
							d="M20.3 5.3A18 18 0 0 0 15.8 4c-.2.4-.5.9-.6 1.3a16.8 16.8 0 0 0-6.4 0A9 9 0 0 0 8.2 4 18 18 0 0 0 3.7 5.3C1 9.3.3 13.2.6 17c1.9 1.4 3.7 2.2 5.5 2.8.4-.6.8-1.2 1.1-1.9-.6-.2-1.2-.5-1.7-.9l.4-.3c3.4 1.6 7.1 1.6 10.4 0l.4.3c-.5.4-1.1.7-1.7.9.3.7.7 1.3 1.1 1.9 1.8-.6 3.6-1.4 5.5-2.8.4-4.4-.7-8.3-2.8-11.7ZM9.7 14.6c-1 0-1.8-.9-1.8-2.1 0-1.1.8-2.1 1.8-2.1 1 0 1.9 1 1.8 2.1 0 1.2-.8 2.1-1.8 2.1Zm5.1 0c-1 0-1.8-.9-1.8-2.1 0-1.1.8-2.1 1.8-2.1 1 0 1.9 1 1.8 2.1 0 1.2-.8 2.1-1.8 2.1Z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</aside>

	<main class="content">
		{#if current}
			<span class="eyebrow">{current.group}</span>
			<h1>{current.title}</h1>
		{/if}
		{@render children()}

		{#if prevPage || nextPage}
			<div class="pager">
				{#if prevPage}
					<a href={docHref(prevPage.slug)} class="pager-link prev">
						<svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
							<path
								d="M15 6l-6 6 6 6"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span>
							<small>Previous</small>
							{prevPage.title}
						</span>
					</a>
				{:else}
					<span></span>
				{/if}

				{#if nextPage}
					<a href={docHref(nextPage.slug)} class="pager-link next">
						<span>
							<small>Next</small>
							{nextPage.title}
						</span>
						<svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
							<path
								d="M9 6l6 6-6 6"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</a>
				{/if}
			</div>
		{/if}
	</main>

	<aside class="toc">
		{#if current}
			<button type="button" class="copy-btn" onclick={copyPage}>
				{#if copied}
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
						<path
							d="M5 12.5 9.5 17 19 7"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Copied
				{:else}
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
						<rect x="8" y="8" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.8" />
						<path
							d="M16 8V6a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 5 6v8A1.5 1.5 0 0 0 6.5 16H8"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Copy page
				{/if}
			</button>
		{/if}

		{#if toc.length}
			<span class="toc-title">On this page</span>
			<ul>
				{#each toc as t}
					{#if t.type === 'h2'}
						<li><a href={`#${t.id}`}>{t.text}</a></li>
					{/if}
				{/each}
			</ul>
		{/if}
	</aside>
</div>

<style>
	.docs-shell {
		display: grid;
		grid-template-columns: 360px minmax(0, 1fr) 300px;
		gap: 60px;
		max-width: 1860px;
		margin: 0 auto;
		padding: 0 36px;
		min-height: 100vh;
	}

	.sidebar {
		border-right: 1px solid var(--border-dim);
	}

	.sidebar-inner {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 36px 30px 36px 0;
		overflow-y: auto;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 23px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin-bottom: 30px;
	}

	.brand-dim {
		font-weight: 500;
		color: var(--text-muted);
	}

	.search {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 18px;
		border-radius: 10.5px;
		border: 1px solid var(--border-base);
		background: var(--bg-surface);
		color: var(--text-muted);
		margin-bottom: 36px;
	}

	.search-icon {
		flex-shrink: 0;
	}

	.search input {
		flex: 1;
		border: none;
		background: none;
		outline: none;
		font-size: 20px;
		color: var(--text-primary);
		font-family: inherit;
	}

	.search input::placeholder {
		color: var(--text-muted);
	}

	nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.group-title {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 12px;
	}

	.group ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.group a {
		display: block;
		padding: 12px 18px;
		margin-left: -18px;
		border-radius: 8px;
		font-size: 21px;
		color: var(--text-secondary);
		transition: color 0.15s ease, background 0.15s ease;
	}

	.group a:hover {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--text-primary) 5%, transparent);
	}

	.group a.active {
		color: var(--leaf-bright);
		background: color-mix(in srgb, var(--leaf-mid) 14%, transparent);
		font-weight: 600;
	}

	.back-link {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 36px;
		padding-top: 30px;
		border-top: 1px solid var(--border-dim);
		font-size: 20px;
		color: var(--text-muted);
		transition: color 0.15s ease;
	}

	.back-link:hover {
		color: var(--text-primary);
	}

	.social-row {
		display: flex;
		align-items: center;
		gap: 24px;
		margin-top: 24px;
		color: var(--text-muted);
	}

	.social-row a {
		display: flex;
		transition: color 0.15s ease;
	}

	.social-row a:hover {
		color: var(--text-primary);
	}

	.content {
		padding: 96px 0 144px;
		min-width: 0;
		max-width: 1020px;
	}

	.eyebrow {
		display: block;
		font-size: 20px;
		font-weight: 600;
		color: var(--text-muted);
		margin-bottom: 12px;
	}

	.content h1 {
		font-size: 48px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		margin-bottom: 48px;
	}

	.toc {
		padding: 96px 0;
		position: sticky;
		top: 96px;
		align-self: start;
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-top: 96px;
		padding-top: 48px;
		border-top: 1px solid var(--border-dim);
	}

	.pager-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 24px;
		border-radius: 10.5px;
		border: 1px solid var(--border-base);
		background: var(--bg-surface);
		color: var(--text-secondary);
		transition: border-color 0.15s ease, color 0.15s ease;
	}

	.pager-link:hover {
		border-color: var(--border-strong);
		color: var(--text-primary);
	}

	.pager-link.next {
		grid-column: 2;
		justify-content: flex-end;
		text-align: right;
	}

	.pager-link span {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.pager-link small {
		font-size: 16.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.copy-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 18px;
		margin-bottom: 30px;
		border-radius: 8px;
		border: 1px solid var(--border-base);
		background: var(--bg-surface);
		font-size: 19px;
		font-weight: 500;
		color: var(--text-secondary);
		cursor: pointer;
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.copy-btn:hover {
		color: var(--text-primary);
		border-color: var(--border-strong);
	}

	.toc-title {
		display: block;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 18px;
	}

	.toc ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-left: 1px solid var(--border-dim);
	}

	.toc a {
		display: block;
		padding: 3px 0 3px 18px;
		margin-left: -1px;
		border-left: 1px solid transparent;
		font-size: 20px;
		color: var(--text-muted);
		transition: color 0.15s ease, border-color 0.15s ease;
	}

	.toc a:hover {
		color: var(--text-primary);
		border-left-color: var(--border-strong);
	}

	@media (max-width: 1620px) {
		.docs-shell {
			grid-template-columns: 330px minmax(0, 1fr);
		}

		.toc {
			display: none;
		}
	}

	@media (max-width: 1140px) {
		.docs-shell {
			display: block;
			padding: 0 24px;
		}

		.sidebar {
			border-right: none;
			border-bottom: 1px solid var(--border-dim);
		}

		.sidebar-inner {
			position: static;
			height: auto;
			padding: 30px 0;
			overflow: visible;
		}

		.content {
			max-width: none;
			padding: 48px 0 96px;
		}
	}
</style>
