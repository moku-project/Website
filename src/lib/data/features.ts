export interface FeatureCard {
	eyebrow: string;
	title: string;
	description: string;
	image?: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
	{
		eyebrow: 'Moku',
		title: 'A fast, minimal reader for your own server.',
		description: 'Moku is a lightweight manga, novel, and anime reader for your own Tsunagu server, with extension support and no Electron overhead.',
		image: '/screenshots/search.webp'
	},
	{
		eyebrow: 'Reader',
		title: 'Set it up once, read it your way.',
		description: 'Layout, page fit, direction, transitions — tune the reader to how you actually read and it stays that way.',
		image: '/screenshots/reader-settings.webp'
	},
	{
		eyebrow: 'Details',
		title: 'Everything about a series, in one place.',
		description: 'Synopsis, tags, status, and chapter count up front, so you know what you’re starting before you start it.',
		image: '/screenshots/preview.webp'
	},
	{
		eyebrow: 'Sync',
		title: 'Your AniList progress, kept in sync.',
		description: 'Update status and score from inside Moku and it reflects back to AniList automatically.',
		image: '/screenshots/tracking.webp'
	},
	{
		eyebrow: 'Offline',
		title: 'Download it, read it anywhere.',
		description: 'Queue a full series for offline and pick up any chapter later with no connection required.',
		image: '/screenshots/downloads.webp'
	}
];
