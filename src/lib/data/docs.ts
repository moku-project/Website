export type Block =
	| { type: 'p'; text: string }
	| { type: 'h2'; id: string; text: string }
	| { type: 'code'; code: string }
	| { type: 'ul'; items: string[] }
	| { type: 'note'; text: string }
	| { type: 'table'; rows: [string, string][] };

export interface DocPage {
	slug: string;
	title: string;
	group: string;
	blocks: Block[];
}

function h2(text: string): Block {
	return { type: 'h2', id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), text };
}

export const DOC_PAGES: DocPage[] = [
	{
		slug: 'overview',
		title: 'Overview',
		group: 'Getting Started',
		blocks: [
			{
				type: 'p',
				text: 'Moku is a fast, minimal manga, novel and anime reader. It’s a lightweight Tauri frontend for the [Tsunagu](/docs/tsunagu/overview) backend, with no Electron overhead. Desktop builds bundle Tsunagu and supervise it for you.'
			},
			h2('What it does'),
			{
				type: 'ul',
				items: [
					'One library, one reader shell. The right viewer (pages, scrolling text, or video player) mounts per title based on its content type.',
					'Organize titles into folders, each with its own sort order and status filter.',
					'Track progress on AniList with two-way sync.',
					'Install source extensions directly from the app, compatible with Mihon/Tachiyomi, Aniyomi, and LNReader repositories.',
					'Queue and monitor chapter downloads for offline reading, with automation rules to keep them fresh.'
				]
			},
			h2('Where to start'),
			{
				type: 'p',
				text: 'Head to [Installation](/docs/installation) to get Moku running, then [Connecting to a server](/docs/server) if you want to point it at your own Tsunagu instance instead of the bundled one. [Features](/docs/reader) covers what the app can do; [Architecture](/docs/codebase-structure) is for anyone digging into the source.'
			}
		]
	},
	{
		slug: 'installation',
		title: 'Installation',
		group: 'Getting Started',
		blocks: [
			{ type: 'p', text: 'Moku ships prebuilt for Windows, macOS, and Linux. All desktop builds bundle the Tsunagu backend and a JRE, nothing else to install.' },
			h2('Windows'),
			{ type: 'code', code: 'winget install Moku.Moku' },
			{ type: 'p', text: 'Or download the `.exe` installer from the [releases page](https://github.com/moku-project/Moku/releases/latest).' },
			h2('macOS'),
			{ type: 'p', text: 'Download the `.dmg` from the [releases page](https://github.com/moku-project/Moku/releases/latest). Builds are ad-hoc signed, so on first launch run:' },
			{ type: 'code', code: 'xattr -rd com.apple.quarantine /Applications/Moku.app' },
			h2('Linux'),
			{ type: 'p', text: 'With Nix:' },
			{ type: 'code', code: 'nix run github:moku-project/Moku' },
			{ type: 'p', text: 'Or add it to a flake:' },
			{ type: 'code', code: 'inputs.moku.url = "github:moku-project/Moku";' },
			{ type: 'p', text: 'Arch users can build from source with `packaging/PKGBUILD`. This packages the frontend only, so install a `tsunagu` package or set `TSUNAGU_BIN` so the app has a backend to talk to.' },
			{ type: 'note', text: 'Prebuilt artifacts are pushed to Cachix, so `nix run`/`nix develop` won’t compile Moku or Tsunagu locally. See [Binary cache (Cachix)](/docs/cachix).' }
		]
	},
	{
		slug: 'server',
		title: 'Connecting to a server',
		group: 'Getting Started',
		blocks: [
			{
				type: 'p',
				text: 'The desktop and Nix builds bundle and launch Tsunagu automatically, connecting to `http://127.0.0.1:6007` by default.'
			},
			h2('Pointing at your own instance'),
			{
				type: 'p',
				text: 'Go to **Settings → General → Server URL** and enter the address of any Tsunagu instance, local or remote. If that server has a password set, Moku prompts for it once and stays signed in on that device.'
			},
			{
				type: 'p',
				text: 'See [Server auth & app lock](/docs/server-auth) for how the two credential types work, and [Tsunagu → Authentication](/docs/tsunagu/authentication) for the server-side detail.'
			}
		]
	},
	{
		slug: 'cachix',
		title: 'Binary cache (Cachix)',
		group: 'Getting Started',
		blocks: [
			{
				type: 'p',
				text: 'Prebuilt artifacts for Moku and Tsunagu are pushed to [moku.cachix.org](https://app.cachix.org/cache/moku) so `nix run` and `nix develop` don’t have to compile either from source.'
			},
			h2('Using it'),
			{
				type: 'p',
				text: 'The cache is declared in `flake.nix` (`nixConfig`), so `nix run`/`nix develop` against this flake will offer to use it. Accept the prompt, or pass `--accept-flake-config`:'
			},
			{ type: 'code', code: 'nix run --accept-flake-config github:moku-project/Moku' },
			h2('Trusting it permanently'),
			{
				type: 'p',
				text: 'Recommended for CI and other non-interactive use. Add to `/etc/nix/nix.conf` (or `~/.config/nix/nix.conf`):'
			},
			{
				type: 'code',
				code: 'extra-substituters = https://moku.cachix.org\nextra-trusted-public-keys = moku.cachix.org-1:EnMXp6/uQVI6IRbKW0xEQylSYoV2N4vszOsoW6/Pq1s='
			},
			{ type: 'p', text: 'Or with the [Cachix CLI](https://docs.cachix.org/installation):' },
			{ type: 'code', code: 'cachix use moku' },
			{ type: 'note', text: 'On NixOS, add the two `extra-*` lines above under `nix.settings` instead of `nix.conf`.' }
		]
	},

	{
		slug: 'reader',
		title: 'Reader & player',
		group: 'Features',
		blocks: [
			{
				type: 'p',
				text: 'Manga and novels share one reader shell; anime gets its own player. Which one mounts is decided automatically by a title’s content type. Settings live under **Settings → Reader** and **Settings → Player**.'
			},
			h2('Manga reader'),
			{
				type: 'table',
				rows: [
					['Page style', 'Single, Double, Auto, or Longstrip'],
					['Fit mode', 'Fit width, Fit height, Fit screen, or Original (1:1)'],
					['Transition', 'None, Fade, Slide, or Flip (swipe)'],
					['Reading direction', 'Left to right or right to left'],
					['Bar position', 'Top, left, or right'],
					['Pages to preload', '0–10, prefetched in the background']
				]
			},
			{
				type: 'ul',
				items: [
					'**Page gap** adds spacing between pages in single-page mode.',
					'**Tap to toggle bar** shows or hides the chrome on a double tap.',
					'**Containerized view** renders the reader inside the app shell instead of taking the whole screen.',
					'**Optimize contrast** sharpens dark lines on light pages, aimed at black-and-white manga.',
					'**Auto-mark read**, **auto-advance chapters**, and **auto-bookmark** handle progress without manual taps.'
				]
			},
			{ type: 'p', text: 'All core reader actions are rebindable, see [Keybinds](/docs/keybinds).' },
			h2('Anime player'),
			{
				type: 'ul',
				items: [
					'**Autoplay next episode** and **tap to toggle bar**, mirroring the reader’s options.',
					'**Subtitles enabled by default**, with a free-text **preferred subtitle language**.',
					'**Video upscaling (experimental)** applies an Anime4K-style WebGL sharpening pass; known to render incorrectly on Linux.',
					'**Nethermind mode** swaps in a compact transport bar.'
				]
			},
			{ type: 'p', text: 'Subtitle size and position, playback speed, quality, and source selection live in the in-player controls rather than Settings. Subtitles render via ASS, converted to VTT, with DASH and HLS stream support alongside direct file playback.' }
		]
	},
	{
		slug: 'player',
		title: 'Library & tracking',
		group: 'Features',
		blocks: [
			h2('Library'),
			{
				type: 'ul',
				items: [
					'Crop cover images, show card stats, and control what appears in the Saved tab (all items vs. only unfoldered, hide completed).',
					'**Auto-link on open** links similarly titled entries automatically; **disable auto-complete** stops fully-read manga from moving to a Completed folder on their own.',
					'Default chapter sort direction, newest or oldest first.',
					'Clear reading history from one button, with a live count of what’s stored.'
				]
			},
			h2('Folders'),
			{
				type: 'p',
				text: 'Custom folders can be created, renamed, reordered, and deleted from **Settings → Folders**. Each folder keeps its own independent sort order and publication-status filter (Ongoing, Completed, Hiatus, and more).'
			},
			h2('Tracking'),
			{
				type: 'p',
				text: 'AniList connects through an OAuth-style flow: Authorize opens an external auth URL and the app polls for the connection, or you can paste back a redirect URL manually. Once connected you get the linked username, an **Import from AniList** button that pulls your existing library in, and two-way progress sync. MyAnimeList is visible in the list but marked "Coming soon".'
			},
			{
				type: 'note',
				text: 'If a tracker has no OAuth client configured, Moku shows a message asking the server operator to set the relevant client ID (e.g. `TSUNAGU_ANILIST_CLIENT_ID`) on the Tsunagu side.'
			}
		]
	},
	{
		slug: 'downloads-automation',
		title: 'Downloads & automation',
		group: 'Features',
		blocks: [
			h2('Downloads'),
			{
				type: 'p',
				text: 'The download queue shows live per-item progress with toasts, plus a history view for completed downloads and automatic retry on failure. A storage-warning dialog steps in before you fill the disk.'
			},
			h2('Automation'),
			{
				type: 'p',
				text: 'Automation rules live at two levels: global defaults under **Settings → Automation**, and per-series overrides opened from a title’s Series Detail page. A master toggle enables the system, and an **enforce global defaults** switch can lock out per-series overrides entirely.'
			},
			{
				type: 'table',
				rows: [
					['Auto-download new chapters', 'Downloads new chapters as they appear'],
					['Download ahead', 'Off, 2, 5, or 10 chapters pre-fetched while reading'],
					['Max chapters to keep', 'Off, 5, 10, or 25; oldest deleted past the limit'],
					['Delete after reading', 'Removes a chapter once read, with a delay of now, 1 day, or 1 week'],
					['Default refresh interval', 'Daily, weekly, or manual update checks']
				]
			},
			{
				type: 'p',
				text: 'Per-series overrides use the same options, plus scanlator preferences (preferred, filtered, blacklisted, forced) and a pause-updates flag. Settings → Automation shows how many series have custom overrides and can reset them all back to the global defaults in one action.'
			}
		]
	},
	{
		slug: 'extensions',
		title: 'Extensions',
		group: 'Features',
		blocks: [
			{
				type: 'p',
				text: 'Install and manage source extensions directly from the app, no manual repo wrangling. Moku is compatible with three extension ecosystems:'
			},
			{
				type: 'ul',
				items: [
					'**Mihon** (Tachiyomi’s spiritual successor), for manga.',
					'**Aniyomi**, for anime and manga sources.',
					'**LNReader**, for light novels, its own plugin format.'
				]
			},
			{
				type: 'p',
				text: 'Extensions are grouped by repository under **Extensions**, with per-extension settings panels and a source migration tool for moving a series from one source to another without losing progress.'
			},
			{
				type: 'p',
				text: 'Library backups also use the Mihon/Tachiyomi `.tachibk` format for manga and novels, so an existing library transfers over. See [Backups & storage](/docs/backups-storage).'
			}
		]
	},
	{
		slug: 'themes',
		title: 'Themes & appearance',
		group: 'Features',
		blocks: [
			{
				type: 'p',
				text: 'Five built-in themes ship with the app: Original, Dark, Light, Midnight, and Warm. **Match system theme** picks between a chosen dark and light theme automatically based on the OS.'
			},
			h2('Custom themes'),
			{
				type: 'p',
				text: 'The theme editor builds a custom theme from a small set of color tokens (background, surface, accent, text, and so on), shown as live swatches while you edit. Custom themes sit in the same picker grid as the built-ins and can be edited or deleted at any time.'
			},
			h2('Solid UI'),
			{
				type: 'p',
				text: '**Solid reader & player UI** turns off the frosted-glass blur on reader and player bars, menus, and panels in favor of flat, opaque backgrounds.'
			}
		]
	},
	{
		slug: 'keybinds',
		title: 'Keybinds',
		group: 'Features',
		blocks: [
			{
				type: 'p',
				text: 'Every reader keybind is rebindable from **Settings → Keybinds**: click a binding, press the new combo, done. Each row has its own reset, plus one global reset for all of them.'
			},
			{
				type: 'table',
				rows: [
					['Turn page right', '`→`'],
					['Turn page left', '`←`'],
					['Jump to first page', '`ctrl + ←`'],
					['Jump to last page', '`ctrl + →`'],
					['Turn chapter right', '`]`'],
					['Turn chapter left', '`[`'],
					['Exit reader', '`Backspace`'],
					['Toggle reading direction', '`d`'],
					['Toggle page style', '`q`'],
					['Toggle fullscreen', '`f`'],
					['Open settings', '`o`'],
					['Toggle bookmark', '`m`'],
					['Toggle auto scroll', '`s`']
				]
			}
		]
	},

	{
		slug: 'settings-overview',
		title: 'Settings overview',
		group: 'Customization',
		blocks: [
			{
				type: 'p',
				text: 'Settings are split into tabs. Most are covered in depth elsewhere in these docs; this page is the map.'
			},
			{
				type: 'table',
				rows: [
					['General', 'Interface scale, server URL, close-button behavior, idle timeout, Discord Rich Presence'],
					['Reader', 'See [Reader & player](/docs/reader)'],
					['Player', 'See [Reader & player](/docs/reader)'],
					['Appearance', 'See [Themes & appearance](/docs/themes)'],
					['Keybinds', 'See [Keybinds](/docs/keybinds)'],
					['Automation', 'See [Downloads & automation](/docs/downloads-automation)'],
					['Content', 'See [Content filtering](/docs/content-filtering)'],
					['Library', 'See [Library & tracking](/docs/player)'],
					['Folders', 'See [Library & tracking](/docs/player)'],
					['Tracking', 'See [Library & tracking](/docs/player)'],
					['Auth', 'See [Server auth & app lock](/docs/server-auth)'],
					['Server', 'Passthrough of Tsunagu server config, see [Tsunagu → Configuration](/docs/tsunagu/configuration)'],
					['Storage', 'See [Backups & storage](/docs/backups-storage)'],
					['Performance', 'Render limit, GPU acceleration, splash animation, session cache stats'],
					['Dev tools', 'Developer-only utilities: test toasts, changelog preview, onboarding replay'],
					['About', 'Version, platform, server build info, release list, GitHub and Discord links']
				]
			},
			h2('General'),
			{
				type: 'ul',
				items: [
					'**Interface scale** from 50% to 200%, with presets.',
					'**Close button behavior**: ask, minimize to tray, or quit; a separate toggle controls title bar visibility.',
					'**Idle screen timeout**, from never up to 30 minutes.',
					'**Preferred source language**, pre-fills search and source grouping.'
				]
			},
			h2('Performance'),
			{
				type: 'ul',
				items: [
					'**Render limit** sets items per page: 12, 24, 48, 96, or 200.',
					'**GPU acceleration** and **animated splash background** toggles.',
					'A live session cache panel shows entry count and age, with a manual clear.'
				]
			}
		]
	},
	{
		slug: 'content-filtering',
		title: 'Content filtering',
		group: 'Customization',
		blocks: [
			{
				type: 'p',
				text: 'Content filtering is enforced server-side and configured from **Settings → Content**.'
			},
			h2('Content level'),
			{
				type: 'table',
				rows: [
					['Strict', 'Hides all explicit and violent content'],
					['Moderate', 'Hides explicit content, allows gore'],
					['Unrestricted', 'Shows everything']
				]
			},
			h2('Filter rules'),
			{
				type: 'p',
				text: 'Beyond the level, individual rules match keywords against genre, tag, title, or description fields, each with its own block level. Tag rules can require a minimum AniList tag weight (0–100) before they trigger. Rules can be reseeded from Moku’s defaults or reset entirely, and an existing library can be rescanned against updated rules.'
			},
			h2('Source overrides'),
			{
				type: 'p',
				text: 'Individual sources can be force-allowed or always-blocked, overriding the content level for that source specifically. Sources with multiple language variants are grouped together, with a search filter to find them quickly.'
			}
		]
	},
	{
		slug: 'backups-storage',
		title: 'Backups & storage',
		group: 'Customization',
		blocks: [
			{
				type: 'p',
				text: 'Backups live under **Settings → Storage**, split into three independent systems.'
			},
			h2('Database backup'),
			{
				type: 'p',
				text: 'A full server-side SQLite snapshot, restored by swapping the file back in while the server is stopped. Existing snapshots are listed with reveal and delete actions.'
			},
			h2('Library backup'),
			{
				type: 'p',
				text: 'Exports a `.tachibk` file in Mihon/Tachiyomi format, covering manga and novels only (anime has no equivalent concept in that format). Import reads `.tachibk` files placed in the server’s backups folder.'
			},
			h2('App data backup'),
			{
				type: 'p',
				text: 'Exports or imports all of Moku’s app settings (not library data) as a `.zip`. Importing reloads the app immediately. Pre-update snapshots are also taken automatically, with the last five kept.'
			},
			h2('Reset'),
			{
				type: 'p',
				text: 'Separate actions clear all caches, clear reading history, or reset every Moku setting back to default. A full settings reset force-quits the app on a short countdown so it takes effect on relaunch; it never touches library data.'
			}
		]
	},
	{
		slug: 'server-auth',
		title: 'Server auth & app lock',
		group: 'Customization',
		blocks: [
			{
				type: 'p',
				text: 'Two separate lock layers exist, configured from **Settings → Auth**, and they don’t interact with each other.'
			},
			h2('Server password'),
			{
				type: 'p',
				text: 'Requiring a password protects the Tsunagu server itself once it’s reachable from outside localhost. Setting one issues a token stored locally through the OS credential store; disabling it clears that token. A static API token, if the server operator has set one, keeps working alongside a password rather than replacing it. See [Tsunagu → Authentication](/docs/tsunagu/authentication) for how the server enforces this.'
			},
			h2('App lock'),
			{
				type: 'p',
				text: 'A numeric PIN (up to 8 digits) can be required at Moku startup; leaving it empty disables the lock. On Windows, Windows Hello can stand in for typing the PIN, but only once a PIN has already been set.'
			}
		]
	},

	{
		slug: 'codebase-structure',
		title: 'Codebase structure',
		group: 'Architecture',
		blocks: [
			{
				type: 'p',
				text: 'Moku’s frontend is SvelteKit; its native shell is Tauri v2. Routes are thin, almost all UI logic lives under `src/lib`.'
			},
			h2('Top level'),
			{
				type: 'table',
				rows: [
					['`src/`', 'SvelteKit frontend (Svelte 5 runes, TypeScript)'],
					['`src-tauri/`', 'Tauri v2 Rust shell'],
					['`static/`', 'Assets served as-is'],
					['`packaging/`', 'Flatpak, AppStream, and Arch PKGBUILD packaging'],
					['`nix/`', 'Nix package derivation, dev shell, and pinned versions'],
					['`scripts/`', 'Build helpers, including staging the Tsunagu sidecar binary']
				]
			},
			h2('src/lib'),
			{
				type: 'table',
				rows: [
					['`components/`', 'One folder per feature area: reader/player under `media/`, plus `library`, `extensions`, `downloads`, `tracking`, `series`, `settings`, `chrome`, and more'],
					['`state/`', 'Global state, one `*.svelte.ts` file per domain, built on Svelte 5 runes rather than the older store API'],
					['`server-adapters/tsunagu/`', 'One file per backend domain (library, folders, downloads, extensions, trackers, and so on), aggregated into a single `tsunagu` object'],
					['`graphql/`', 'A small hand-written fetch-based GraphQL client, no codegen'],
					['`platform-adapters/` + `platform-service/`', 'A shared interface with separate Tauri and web implementations, so the same codebase targets both a desktop build and a plain web build'],
					['`core/`', 'Framework-agnostic logic: caching, keybind engine, persistence, cover resolution']
				]
			},
			h2('src-tauri'),
			{
				type: 'table',
				rows: [
					['`src/lib.rs`', 'App bootstrap: single-instance handling, plugin registration, tray icon, shutdown'],
					['`src/backend.rs`', 'Supervises the bundled Tsunagu process, see [Design choices](/docs/design-choices)'],
					['`src/commands/`', 'Tauri commands grouped by domain: backup, biometric auth, storage, system, updater']
				]
			}
		]
	},
	{
		slug: 'design-choices',
		title: 'Design choices',
		group: 'Architecture',
		blocks: [
			{
				type: 'p',
				text: 'Moku is a thin client over Tsunagu, which is most of why Tauri makes sense here: the app itself doesn’t need to embed heavy logic, so a small native shell over a webview beats bundling Electron.'
			},
			h2('Backend supervision'),
			{
				type: 'p',
				text: 'On desktop, `src-tauri/src/backend.rs` spawns Tsunagu as a subprocess, waits for a ready signal on stdout, then polls its healthcheck endpoint before reporting the backend ready to the frontend. If the process exits unexpectedly, a crash event carries its exit code and a rolling log tail back to the UI. On Unix, the child is set to die with its parent; on stop, it gets a graceful `SIGTERM` before a hard kill.'
			},
			h2('Talking to Tsunagu'),
			{
				type: 'p',
				text: 'There’s no GraphQL codegen. `src/lib/graphql/client.ts` is a small hand-written function that posts queries over fetch, attaches auth headers, and throws typed errors on failure. Each domain under `server-adapters/tsunagu/` hand-writes its own query and mutation strings rather than generating them from a schema.'
			},
			h2('Platform abstraction'),
			{
				type: 'p',
				text: 'A single `platformService` interface is implemented once for Tauri and once for plain web, letting the same SvelteKit codebase build as a static site or as a desktop app depending on the build target.'
			},
			h2('State'),
			{
				type: 'p',
				text: 'All global state uses Svelte 5 runes rather than the classic store API, one module per domain (library, settings, downloads, trackers, and so on), imported directly where it’s needed rather than passed through a central reducer.'
			},
			h2('Reader dispatch'),
			{
				type: 'p',
				text: 'There’s exactly one reader route. It resolves the active title’s content type and mounts the matching viewer: novel, anime, or manga by default. The manga viewer further branches into single, double, or longstrip components depending on the page style setting; reader chrome (settings panel, progress bar, chapter navigation) is shared across all three content types.'
			}
		]
	},
	{
		slug: 'development',
		title: 'Development',
		group: 'Architecture',
		blocks: [
			{
				type: 'p',
				text: 'Prerequisites: [Rust](https://rustup.rs), [Node.js](https://nodejs.org), [pnpm](https://pnpm.io), and the [Tauri v2 prerequisites](https://tauri.app/start/prerequisites/).'
			},
			{
				type: 'code',
				code: 'git clone https://github.com/moku-project/Moku\ncd Moku\npnpm install\npnpm tauri:dev'
			},
			{ type: 'p', text: 'Or with Nix, which skips installing the Rust/Node toolchain yourself:' },
			{ type: 'code', code: 'nix develop\npnpm install\npnpm tauri:dev' },
			h2('Stack'),
			{
				type: 'table',
				rows: [
					['Tauri v2', 'Native app shell'],
					['Svelte 5 + SvelteKit 2', 'UI, built with runes rather than the classic store API'],
					['TypeScript', 'Type safety'],
					['Vite 8', 'Frontend bundler'],
					['Tsunagu', 'Bundled backend']
				]
			}
		]
	},

	{
		slug: 'contributing',
		title: 'Contributing',
		group: 'Community',
		blocks: [
			{
				type: 'p',
				text: 'Contributions are welcome, code, design, docs, or bug reports. The one ask: talk before you start.'
			},
			h2('Talk first'),
			{
				type: 'p',
				text: 'Join the [Discord](https://discord.gg/x97hj8zR72) and describe what you’re planning in the dev channel before opening a PR, especially for anything beyond a small fix. It saves everyone the work of a large PR that duplicates something in progress or doesn’t fit the app’s direction.'
			},
			h2('Match the design language'),
			{
				type: 'p',
				text: 'New UI should read as part of the same app, not a bolt-on. In practice that means:'
			},
			{
				type: 'ul',
				items: [
					'Use the existing color and spacing tokens rather than one-off values.',
					'Follow the settings tab patterns already in place for anything that belongs in Settings.',
					'Reuse the shared reader/player chrome instead of building parallel controls for a new content type.',
					'If a change touches visual design in a real way, bring a screenshot or a quick description to Discord first.'
				]
			},
			h2('Code style'),
			{
				type: 'ul',
				items: [
					'Svelte 5 runes for state, not the classic store API, see [Design choices](/docs/design-choices).',
					'TypeScript throughout, no `any` as an escape hatch.',
					'Keep PRs scoped to one change. A bug fix doesn’t need a refactor riding along with it.',
					'Comments explain *why*, not *what*, the code should already say what.'
				]
			},
			h2('Where to start'),
			{
				type: 'p',
				text: 'See [Development](/docs/development) for getting a build running. Tsunagu contributions go through its own repository, working on the backend or extension sandbox will also mean reading [Tsunagu → Architecture](/docs/tsunagu/architecture).'
			}
		]
	},
	{
		slug: 'license',
		title: 'License & attributions',
		group: 'Community',
		blocks: [
			h2('License'),
			{
				type: 'p',
				text: 'Moku is distributed under the [Apache License 2.0](https://github.com/moku-project/Moku/blob/main/LICENSE).'
			},
			{
				type: 'p',
				text: 'Tsunagu doesn’t currently publish a separate license file in its repository; check [moku-project/Tsunagu](https://github.com/moku-project/Tsunagu) for its current terms.'
			},
			h2('Attributions'),
			{
				type: 'p',
				text: 'Moku and Tsunagu exist because of the work these projects did first. Thanks, specifically:'
			},
			{
				type: 'table',
				rows: [
					['[Suwayomi](https://github.com/Suwayomi/Suwayomi-Server) (MPL-2.0)', 'Tsunagu’s architecture is a leaner take on Suwayomi’s self-hosted, JVM-backed model; the extension sandbox also builds against Android API stubs sourced from Suwayomi’s own repository.'],
					['[Mihon](https://github.com/mihonapp/mihon) (Apache-2.0)', 'Source of the extension and `.tachibk` backup formats Moku and Tsunagu are compatible with, and the interface contracts the sandbox implements against.'],
					['[Aniyomi](https://github.com/aniyomiorg/aniyomi) (Apache-2.0)', 'The anime extension format and approach to extending a manga reader into video sources.'],
					['[LNReader](https://github.com/LNReader/lnreader) (MIT)', 'The light novel plugin format and JavaScript-based plugin execution model.']
				]
			},
			{
				type: 'note',
				text: 'These projects are unaffiliated with Moku beyond format and approach compatibility. Their licenses apply to their own code, not to Moku or Tsunagu.'
			}
		]
	},

	{
		slug: 'tsunagu/overview',
		title: 'Overview',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Tsunagu is the self-hosted backend behind Moku: a Go API server handling your library, database, download queue, and media pipelines, with a JVM sandbox that loads and runs source extensions.'
			},
			{
				type: 'p',
				text: 'Desktop Moku builds bundle and supervise Tsunagu automatically. You only need this section if you’re running it standalone, remotely, self-hosting it on a NAS, or developing against it.'
			},
			h2('Layout'),
			{
				type: 'table',
				rows: [
					['`backend/`', 'Go API server: GraphQL, REST content routes, DB, download queue, trackers, content filtering'],
					['`sandbox/`', 'Kotlin/JVM extension loader and executor, built with Gradle'],
					['`proto/`', 'The gRPC contract between backend and sandbox']
				]
			},
			h2('Why Go, with a JVM sandbox on the side'),
			{
				type: 'p',
				text: 'Tsunagu positions itself as a leaner alternative to running a full JVM server: the JVM is confined to the one job that needs it, running community extension code, while everything else (the API, the database, downloads, image proxying) is Go. See [Architecture](/docs/tsunagu/architecture) for how the two talk to each other.'
			},
			h2('API'),
			{
				type: 'p',
				text: 'A single GraphQL endpoint at `http://localhost:6007/api/graphql`, with a playground at `/api/graphql/playground`. A handful of REST routes exist alongside it for byte streaming and auth; see [API reference](/docs/tsunagu/api).'
			}
		]
	},
	{
		slug: 'tsunagu/installation',
		title: 'Running it',
		group: 'Tsunagu',
		blocks: [
			{ type: 'p', text: 'Standalone, with Nix:' },
			{ type: 'code', code: 'nix develop\ncd backend && go run ./cmd/server' },
			{
				type: 'p',
				text: 'The server binds to `:6007` by default and writes its config to `tsunagu.toml` in the working directory on every save.'
			},
			h2('Docker'),
			{
				type: 'p',
				text: 'A `docker-compose.yml` and `Dockerfile` at the repo root cover the headless self-host path. Images are built multi-arch (`linux/amd64`, `linux/arm64`) and published on release.'
			},
			h2('Startup contract'),
			{
				type: 'p',
				text: 'On a successful bind, and before any slow work, Tsunagu prints `TSUNAGU_READY url=... version=...` to stdout; everything else logs to stderr. This is what a supervising launcher (like Moku’s Tauri shell) watches for before treating the server as up.'
			},
			{
				type: 'p',
				text: 'The JVM sandbox is not started at boot. It’s spawned lazily on the first request that needs a source (browse, search, read, or stream), taking a few seconds to cold start, then stays warm until `idle_timeout_minutes` of inactivity before shutting down again.'
			},
			{ type: 'note', text: '`GET /healthz` reflects the Go server’s own readiness only, not the sandbox. It returns instantly and is meant for startup polling and container healthchecks.' }
		]
	},
	{
		slug: 'tsunagu/configuration',
		title: 'Configuration',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Tsunagu regenerates `tsunagu.toml` on every save. Active (uncommented) lines are authoritative and override whatever the app last set on boot; commented lines just show the default. Some keys need a restart to take effect, noted in the file as `[FULL_RESTART]` or `[SANDBOX_RESTART]`.'
			},
			{
				type: 'table',
				rows: [
					['`data_dir`', 'Root directory for the DB, caches, extensions, and downloads'],
					['`db_path`', 'SQLite database file'],
					['`http_addr`', 'Address the HTTP API binds to (default `:6007`)'],
					['`api_token`', 'Bearer token required on API requests, when set'],
					['`public_url`', 'Externally reachable base URL, for OAuth callbacks and image links'],
					['`media_dir`', 'Where covers, downloads, and other media are stored'],
					['`novel_enabled`', 'Load light-novel extensions in the sandbox'],
					['`idle_timeout_minutes`', 'Stop the sandbox after this many idle minutes (`0` = never)'],
					['`tracker_poll_hours`', 'How often background tracker sync runs (`0` = never)'],
					['`backup_interval_hours`', 'How often an automatic DB backup is taken (`0` = never)'],
					['`backup_retention_count`', 'How many automatic backups to keep before pruning'],
					['`anilist_client_id`', 'AniList OAuth client id; Tsunagu ships a working default'],
					['`mal_client_id` / `mal_client_secret`', 'MyAnimeList OAuth credentials; Tsunagu ships a working default'],
					['`cloudflare_solver_mode`', '`disabled`, `external`, or `managed`, see [Architecture](/docs/tsunagu/architecture)'],
					['`cloudflare_solver_url`', 'FlareSolverr URL used in external mode']
				]
			},
			{
				type: 'p',
				text: 'Settings loaded from `tsunagu.toml` are synced into the database on start. Some, like the content filter level, can be changed live through a GraphQL mutation without a restart at all.'
			}
		]
	},
	{
		slug: 'tsunagu/architecture',
		title: 'Architecture',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Tsunagu is two processes in one package: a Go backend that owns the database, the API, and the download queue, and a JVM sandbox that runs extension code. There’s no separate deployment step for the sandbox, the Go backend supervises it as a child process.'
			},
			h2('Backend and sandbox'),
			{
				type: 'p',
				text: 'The two talk over gRPC on loopback, using the contract in `proto/sandbox/v1/sandbox.proto`. The sandbox is spawned lazily on first use, health-checked, and reaped after `idle_timeout_minutes` of inactivity. If it dies or was never started, every non-sandbox route (library, folders, downloads already on disk) keeps working.'
			},
			{
				type: 'note',
				text: 'Extension code runs with the sandbox process’s full capability, there’s no OS-level sandboxing. It’s treated as semi-trusted, similar in risk to sideloading an app, and safe mainly because the gRPC surface never leaves loopback.'
			},
			h2('GraphQL layer'),
			{
				type: 'p',
				text: 'Built with `gqlgen`. `schema.graphqls` is the source of truth; codegen produces the generated model and exec code, but the resolver file itself is hand-maintained after codegen rather than fully regenerated, since gqlgen’s resolver pass would overwrite hand-written helpers.'
			},
			h2('Download queue'),
			{
				type: 'p',
				text: 'A small worker pool pulls from the queue with pause, resume, reorder, and cancellation support, and automatically requeues anything left orphaned by a crash or restart. What actually gets downloaded depends on content type: page images for manga, chapter HTML for novels, or a muxed video file for anime.'
			},
			h2('Content filtering'),
			{
				type: 'p',
				text: 'Keyword rules are loaded from the database into an in-memory matcher, checked against genre, tag, title, or description fields, each with its own block level. A global level (unrestricted, moderate, or strict) decides which block levels actually get hidden. This is the engine behind Moku’s [content filtering settings](/docs/content-filtering).'
			},
			h2('Cloudflare bypass'),
			{
				type: 'p',
				text: 'Three modes: disabled, external (Tsunagu talks to a FlareSolverr instance you run yourself), or managed, where Tsunagu downloads and runs its own pinned FlareSolverr binary on demand. Managed mode is only available on Linux and Windows amd64, there’s no upstream FlareSolverr build for macOS or arm64.'
			}
		]
	},
	{
		slug: 'tsunagu/extensions',
		title: 'Extension system',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'A repository is an index URL pointing to a Tachiyomi-style JSON extension list. Each entry carries a name, package name, download links for its APK or JAR, an icon, and the sources it provides.'
			},
			h2('What an extension is'),
			{
				type: 'p',
				text: 'Manga and anime extensions are unmodified Mihon/Tachiyomi/Aniyomi extension APKs. Novel extensions are plain JavaScript files following the LNReader plugin shape. Tsunagu ships with zero built-in sources, everything comes from an installed extension.'
			},
			h2('Loading an APK extension'),
			{
				type: 'ul',
				items: [
					'The APK is downloaded and its package name and manifest are read directly from the archive.',
					'It’s converted from Dalvik bytecode to a JVM-runnable jar, since the sandbox isn’t an Android runtime.',
					'It loads through a child-first classloader, so the extension’s own dependency versions win over the sandbox’s.',
					'The loaded source is then driven over gRPC by the sandbox’s extension service.'
				]
			},
			h2('Novel plugins'),
			{
				type: 'p',
				text: 'Each `.js` plugin runs inside its own embedded JavaScript context with a small CommonJS-style module shim and a cheerio-like DOM query API, so unmodified LNReader plugin code runs without a Node process.'
			},
			h2('Go/JVM contract'),
			{
				type: 'p',
				text: 'The gRPC service between the two covers loading and unloading extensions, searching, fetching chapters and pages or episodes and streams, reading and writing source preferences, and rendering per-source filter UIs from a generic filter tree, all without any per-source code on the Go side.'
			}
		]
	},
	{
		slug: 'tsunagu/api',
		title: 'API reference',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Everything goes through one GraphQL endpoint, `POST /api/graphql`, except for a handful of REST routes that stream bytes or handle auth directly.'
			},
			h2('GraphQL, by area'),
			{
				type: 'table',
				rows: [
					['Library', '`library`, `media`, `resolveMedia`, `setInLibrary`, `migrateMedia`, `syncChapters`'],
					['Folders', '`folders`, `createFolder`, `renameFolder`, `deleteFolder`, `reorderFolder`'],
					['Reading', '`readingProgress`, `markChapterRead`, `markChaptersRead`, `updateReadingProgress`'],
					['Downloads', '`downloadQueue`, `enqueueDownload`, `dequeueDownload`, `retryDownload`, `reorderDownload`'],
					['Extensions', '`repositories`, `availableExtensions`, `installExtension`, `uninstallExtension`, `updateExtension`'],
					['Search', '`search`, `filterOptions`, `popularManga`, `latestUpdates`, `localSourceSearch`'],
					['Trackers', '`trackers`, `trackerLogin`, `trackerLogout`, `bindTrack`, `pullTracker`, `trackerLibrary`'],
					['Metadata', '`searchMetadata`, `applyMetadataMatch`, `refreshMetadataMatch`'],
					['Server', '`serverSettings`, `updateServerSetting`, `contentFilterRules`, `storageInfo`, `databaseBackups`']
				]
			},
			h2('REST routes'),
			{
				type: 'table',
				rows: [
					['`GET /content/{mediaId}/{chapterId}/pages/{n}`', 'Byte-streams a page, from disk if downloaded or live otherwise'],
					['`GET /content/{mediaId}/{chapterId}/video`', 'Streams anime video the same way'],
					['`GET /proxy/cover/{mediaId}`', 'Cover image proxy and cache'],
					['`GET /api/auth/status`', 'Whether a password is currently required'],
					['`POST /api/auth/login`', 'Password login, issues a session token'],
					['`GET /api/tracker/mal/callback`', 'MyAnimeList OAuth redirect target'],
					['`GET /healthz`', 'Instant liveness check, independent of the sandbox']
				]
			},
			{
				type: 'note',
				text: '`/healthz`, `/api/auth/status`, `/api/auth/login`, and everything under `/api/tracker/` are exempt from the static API token check. Every other route requires it when `api_token` is set.'
			}
		]
	},
	{
		slug: 'tsunagu/authentication',
		title: 'Authentication',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Two independent, optional gates sit in front of the API. Neither is required for local or loopback use; auth only matters once the server is reachable from outside your machine. CORS is wide open by default, so one of these two is worth setting before exposing a server publicly.'
			},
			h2('Static API token'),
			{
				type: 'p',
				text: 'Set `api_token` in `tsunagu.toml`. Clients send it as `Authorization: Bearer <token>` or `?token=`.'
			},
			h2('Password and sessions'),
			{
				type: 'p',
				text: 'Set a password via the `setPassword` mutation, or from a connected client’s settings. Login via `POST /api/auth/login` returns a 30-day HMAC-signed session token; `GET /api/auth/status` reports whether a password is required.'
			},
			{ type: 'p', text: 'Either credential is accepted independently, and a static token keeps working even once a password is also set.' }
		]
	},
	{
		slug: 'tsunagu/backups',
		title: 'Backups',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Two backup mechanisms cover different scope:'
			},
			{
				type: 'ul',
				items: [
					'**Mihon/Tachiyomi-format export** (`.tachibk`) via `exportMihonBackup`/`importMihonBackup` mutations. Manga and novel library only, anime is never included, since the format has no concept of it.',
					'**SQLite snapshots** via `createDatabaseBackup`/`deleteDatabaseBackup` mutations, plus automatic scheduled snapshots controlled by `backup_interval_hours`/`backup_retention_count` in `tsunagu.toml`.'
				]
			}
		]
	},
	{
		slug: 'tsunagu/packaging',
		title: 'Packaging & deployment',
		group: 'Tsunagu',
		blocks: [
			{
				type: 'p',
				text: 'Each release ships a Go binary for Windows, macOS (Intel and Apple Silicon), and Linux amd64, bundled with the sandbox jar and a minimal `jlink`-built JRE, plus multi-arch Docker images.'
			},
			h2('Data directories'),
			{
				type: 'p',
				text: 'By default Tsunagu writes to an OS-appropriate data directory (`~/.local/share/tsunagu` on Linux, an equivalent config directory elsewhere), overridable with `--data-dir` or the `TSUNAGU_DATA_DIR` environment variable.'
			},
			h2('Shutdown'),
			{
				type: 'p',
				text: 'SIGTERM or Ctrl-C triggers a graceful HTTP drain before the JVM child is stopped. A stale JVM left behind by a previous crashed run is detected and killed on the next startup.'
			},
			h2('Nix'),
			{
				type: 'p',
				text: 'The flake exposes the full server plus sandbox as one package, the Go server alone, the sandbox jar alone, and a minimal JRE, all pulling from the same Cachix binary cache described in [Binary cache (Cachix)](/docs/cachix).'
			}
		]
	}
];

export const DOC_GROUPS = [
	'Getting Started',
	'Features',
	'Customization',
	'Architecture',
	'Community',
	'Tsunagu'
] as const;

export function docHref(slug: string): string {
	return slug === 'overview' ? '/docs' : `/docs/${slug}`;
}
