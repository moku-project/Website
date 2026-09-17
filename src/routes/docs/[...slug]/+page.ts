import { error } from '@sveltejs/kit';
import { DOC_PAGES } from '$lib/data/docs';

export const prerender = true;

export function entries() {
	return DOC_PAGES.filter((p) => p.slug !== 'overview').map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const page = DOC_PAGES.find((p) => p.slug === params.slug);
	if (!page) error(404);
	return { page };
}
