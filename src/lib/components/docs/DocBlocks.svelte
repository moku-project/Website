<script lang="ts">
	import type { Block } from '$lib/data/docs';
	import { renderInline } from '$lib/utils/inline';

	interface Props {
		blocks: Block[];
	}

	let { blocks }: Props = $props();
</script>

{#each blocks as block}
	{#if block.type === 'h2'}
		<h2 id={block.id}>{block.text}</h2>
	{:else if block.type === 'p'}
		<p>{@html renderInline(block.text)}</p>
	{:else if block.type === 'ul'}
		<ul>
			{#each block.items as item}
				<li>{@html renderInline(item)}</li>
			{/each}
		</ul>
	{:else if block.type === 'code'}
		<pre><code>{block.code}</code></pre>
	{:else if block.type === 'note'}
		<div class="note">{@html renderInline(block.text)}</div>
	{:else if block.type === 'table'}
		<table>
			<tbody>
				{#each block.rows as [key, value]}
					<tr>
						<td class="key">{@html renderInline(key)}</td>
						<td class="value">{@html renderInline(value)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
{/each}

<style>
	h2 {
		font-size: 21px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		margin: var(--sp-10) 0 var(--sp-4);
		scroll-margin-top: var(--sp-8);
	}

	h2:first-child {
		margin-top: 0;
	}

	p {
		font-size: 15px;
		line-height: 1.7;
		color: var(--text-secondary);
		margin-bottom: var(--sp-4);
	}

	ul {
		margin: 0 0 var(--sp-4);
		padding-left: var(--sp-5);
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	li {
		font-size: 15px;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	:global(p code),
	:global(li code),
	:global(td code),
	:global(.note code) {
		font-family: var(--font-mono);
		font-size: 13px;
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		color: var(--text-primary);
		white-space: nowrap;
	}

	:global(p strong),
	:global(li strong),
	:global(.note strong) {
		color: var(--text-primary);
		font-weight: 600;
	}

	:global(p a),
	:global(li a),
	:global(.note a) {
		color: var(--text-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
		text-decoration-color: var(--border-strong);
		transition: text-decoration-color 0.15s ease;
	}

	:global(p a:hover),
	:global(li a:hover),
	:global(.note a:hover) {
		text-decoration-color: var(--text-primary);
	}

	pre {
		margin: 0 0 var(--sp-4);
		padding: var(--sp-4) var(--sp-5);
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-base);
		background: var(--bg-surface);
		overflow-x: auto;
	}

	pre code {
		font-family: var(--font-mono);
		font-size: 13.5px;
		line-height: 1.6;
		white-space: pre;
		color: var(--text-primary);
	}

	.note {
		margin-bottom: var(--sp-4);
		padding: var(--sp-4) var(--sp-5);
		border-radius: var(--radius-lg);
		border: 1px solid color-mix(in srgb, var(--leaf-mid) 30%, transparent);
		background: color-mix(in srgb, var(--leaf-dark) 35%, transparent);
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: var(--sp-4);
	}

	tr {
		border-bottom: 1px solid var(--border-dim);
	}

	tr:last-child {
		border-bottom: none;
	}

	td {
		padding: var(--sp-3) var(--sp-2);
		font-size: 14px;
		vertical-align: top;
	}

	td:first-child {
		padding-left: 0;
	}

	.key {
		font-weight: 600;
		color: var(--text-primary);
		width: 38%;
		white-space: nowrap;
	}

	.value {
		color: var(--text-secondary);
		line-height: 1.6;
	}
</style>
