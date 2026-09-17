# Moku Website

The marketing site and docs for [Moku](https://github.com/moku-project/Moku), built with SvelteKit 2 and Svelte 5.

## Developing

```sh
nix develop --command pnpm install
nix develop --command pnpm run dev
```

Or without Nix, with Node 22 and pnpm installed:

```sh
pnpm install
pnpm run dev
```

## Building

```sh
pnpm run build
```

Outputs a static site to `build/`, via `@sveltejs/adapter-static`. Preview it with `pnpm run preview`.

## Structure

| | |
|---|---|
| `src/routes/` | Pages: the homepage (`+page.svelte`) and the `/docs` section |
| `src/lib/components/` | Nav, Hero, card carousel, and the download/extensions modals |
| `src/lib/components/docs/` | The docs renderer |
| `src/lib/data/docs.ts` | All docs content, grouped by section |
| `src/lib/styles/global.css` | Design tokens (color, spacing, radius) |
