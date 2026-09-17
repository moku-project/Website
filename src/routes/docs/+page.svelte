<script lang="ts">
	import DocBlocks from '$lib/components/docs/DocBlocks.svelte';

	let { data } = $props();
</script>

<DocBlocks blocks={data.page.blocks} />
