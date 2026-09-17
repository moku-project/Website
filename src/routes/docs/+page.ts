import { error } from '@sveltejs/kit';
import { DOC_PAGES } from '$lib/data/docs';

export const prerender = true;

export function load() {
	const page = DOC_PAGES.find((p) => p.slug === 'overview');
	if (!page) error(404);
	return { page };
}
