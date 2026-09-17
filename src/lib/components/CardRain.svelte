<script lang="ts">
	interface CardDef {
		cx: number
		w: number
		h: number
		lines: number
		alpha: number
		speed: number
		cycleSec: number
		phase: number
		travel: number
		yStart: number
		angleStart: number
		tilt: number
	}
	interface CardTrig {
		cosA: number
		sinA: number
		tiltRad: number
	}
	interface RenderState {
		cards: CardDef[]
		trigs: CardTrig[]
		stamps: HTMLCanvasElement[]
		vignette: HTMLCanvasElement
		CW: number
		CH: number
		scale: number
	}

	const LAYER_CFG = [
		{ wMin: 26, wMax: 40, speedMin: 30, speedMax: 50, alpha: 0.22 },
		{ wMin: 38, wMax: 56, speedMin: 52, speedMax: 80, alpha: 0.35 },
		{ wMin: 54, wMax: 76, speedMin: 85, speedMax: 120, alpha: 0.5 }
	] as const

	const BUF = 80,
		COLS = 14

	function hash(n: number): number {
		let x = Math.imul(n ^ (n >>> 16), 0x45d9f3b)
		x = Math.imul(x ^ (x >>> 16), 0x45d9f3b)
		return ((x ^ (x >>> 16)) >>> 0) / 0xffffffff
	}

	function buildCards(vw: number, vh: number) {
		const cards: CardDef[] = []
		const laneW = vw / COLS
		for (let layer = 0; layer < 3; layer++) {
			const cfg = LAYER_CFG[layer]
			for (let col = 0; col < COLS; col++) {
				const seed = col * 31 + layer * 97 + 7
				const w = cfg.wMin + hash(seed + 1) * (cfg.wMax - cfg.wMin)
				const h = w * 1.44
				const speed = cfg.speedMin + hash(seed + 5) * (cfg.speedMax - cfg.speedMin)
				const travel = vh + h + BUF
				cards.push({
					cx: (col + 0.5) * laneW + (hash(seed + 2) * 2 - 1) * Math.max(0, (laneW - w) / 2 - 2),
					w,
					h,
					lines: 1 + Math.floor(hash(seed + 7) * 3),
					alpha: cfg.alpha,
					speed,
					cycleSec: travel / speed,
					phase: (col / COLS + hash(seed + 6) * 0.6 + layer * 0.23) % 1,
					travel,
					yStart: vh + h / 2 + BUF / 2,
					angleStart: hash(seed + 3) * 50 - 25,
					tilt: (hash(seed + 4) * 2 - 1) * 18
				})
			}
		}
		const trigs: CardTrig[] = cards.map((c) => ({
			cosA: Math.cos(c.angleStart * (Math.PI / 180)),
			sinA: Math.sin(c.angleStart * (Math.PI / 180)),
			tiltRad: c.tilt * (Math.PI / 180)
		}))
		return { cards, trigs }
	}

	function rrect(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number,
		r: number
	) {
		ctx.beginPath()
		ctx.moveTo(x + r, y)
		ctx.lineTo(x + w - r, y)
		ctx.arcTo(x + w, y, x + w, y + r, r)
		ctx.lineTo(x + w, y + h - r)
		ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
		ctx.lineTo(x + r, y + h)
		ctx.arcTo(x, y + h, x, y + h - r, r)
		ctx.lineTo(x, y + r)
		ctx.arcTo(x, y, x + r, y, r)
		ctx.closePath()
	}

	const STAMP_PAD = 6

	function buildStamp(c: CardDef, dpr: number): HTMLCanvasElement {
		const oc = document.createElement('canvas')
		oc.width = Math.round(Math.ceil(c.w + STAMP_PAD * 2) * dpr)
		oc.height = Math.round(Math.ceil(c.h + STAMP_PAD * 2) * dpr)
		const ctx = oc.getContext('2d')!
		ctx.scale(dpr, dpr)
		const x0 = STAMP_PAD,
			y0 = STAMP_PAD
		const coverH = c.w * 0.72 * 1.05
		const lineY0 = y0 + 3 + coverH + 5
		ctx.fillStyle = 'rgba(0,0,0,0.5)'
		rrect(ctx, x0 + 2, y0 + 2, c.w, c.h, 4)
		ctx.fill()
		ctx.fillStyle = 'rgba(255,255,255,0.07)'
		rrect(ctx, x0, y0, c.w, c.h, 4)
		ctx.fill()
		ctx.strokeStyle = 'rgba(255,255,255,0.75)'
		ctx.lineWidth = 1.2
		rrect(ctx, x0, y0, c.w, c.h, 4)
		ctx.stroke()
		ctx.fillStyle = 'rgba(255,255,255,0.15)'
		rrect(ctx, x0 + 3, y0 + 3, c.w - 6, coverH, 3)
		ctx.fill()
		ctx.fillStyle = 'rgba(255,255,255,0.08)'
		rrect(ctx, x0 + 3, y0 + 3, (c.w - 6) * 0.45, coverH, 3)
		ctx.fill()
		for (let li = 0; li < c.lines; li++) {
			ctx.fillStyle = li === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.20)'
			ctx.fillRect(x0 + 4, lineY0 + li * 8, (c.w - 8) * (li === 0 ? 0.78 : 0.52), li === 0 ? 3 : 2)
		}
		return oc
	}

	function buildVignette(vw: number, vh: number, dpr: number): HTMLCanvasElement {
		const oc = document.createElement('canvas')
		oc.width = Math.round(vw * dpr)
		oc.height = Math.round(vh * dpr)
		const ctx = oc.getContext('2d')!
		ctx.scale(dpr, dpr)
		const g = ctx.createRadialGradient(vw / 2, vh / 2, 0, vw / 2, vh / 2, Math.max(vw, vh) * 0.65)
		g.addColorStop(0, 'rgba(0,0,0,0)')
		g.addColorStop(0.4, 'rgba(0,0,0,0)')
		g.addColorStop(0.7, 'rgba(0,0,0,0.25)')
		g.addColorStop(1, 'rgba(0,0,0,0.65)')
		ctx.fillStyle = g
		ctx.fillRect(0, 0, vw, vh)
		return oc
	}

	function drawFrame(
		ctx: CanvasRenderingContext2D,
		t: number,
		cw: number,
		ch: number,
		dpr: number,
		cards: CardDef[],
		trigs: CardTrig[],
		stamps: HTMLCanvasElement[],
		vignette: HTMLCanvasElement
	) {
		ctx.clearRect(0, 0, cw, ch)
		for (let i = 0; i < cards.length; i++) {
			const c = cards[i]
			const p = (t / c.cycleSec + c.phase) % 1
			const alpha = p < 0.07 ? (p / 0.07) * c.alpha : p > 0.86 ? ((1 - p) / 0.14) * c.alpha : c.alpha
			if (alpha < 0.005) continue
			const cy = c.yStart - p * c.travel
			const tg = trigs[i]
			const delta = tg.tiltRad * p
			const cos = tg.cosA * Math.cos(delta) - tg.sinA * Math.sin(delta)
			const sin = tg.sinA * Math.cos(delta) + tg.cosA * Math.sin(delta)
			ctx.globalAlpha = alpha
			ctx.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, c.cx * dpr, cy * dpr)
			const sw = stamps[i].width / dpr,
				sh = stamps[i].height / dpr
			ctx.drawImage(stamps[i], -sw / 2, -sh / 2, sw, sh)
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.globalAlpha = 1
		ctx.drawImage(vignette, 0, 0, cw, ch)
	}

	function mountCanvas(el: HTMLCanvasElement) {
		const ctx = el.getContext('2d')!
		let live: RenderState | null = null
		let lastLogW = 0,
			lastLogH = 0,
			lastScale = 0,
			buildGen = 0

		function cleanup() {
			if (live) {
				live.stamps.forEach((c) => {
					c.width = 0
					c.height = 0
				})
				live.vignette.width = 0
				live.vignette.height = 0
				live = null
			}
			ctx.clearRect(0, 0, el.width, el.height)
		}

		function applySize(logW: number, logH: number, scale: number) {
			const gen = ++buildGen
			if (logW <= 0 || logH <= 0) return
			if (logW === lastLogW && logH === lastLogH && scale === lastScale) return
			lastLogW = logW
			lastLogH = logH
			lastScale = scale
			if (live) cleanup()
			const built = buildCards(logW, logH)
			const stamps = built.cards.map((c) => buildStamp(c, scale))
			const vig = buildVignette(logW, logH, scale)
			el.width = Math.round(logW * scale)
			el.height = Math.round(logH * scale)
			if (gen === buildGen) {
				live = { cards: built.cards, trigs: built.trigs, stamps, vignette: vig, CW: el.width, CH: el.height, scale }
			}
		}

		const syncWeb = () => applySize(el.clientWidth, el.clientHeight, window.devicePixelRatio || 1)
		const ro = new ResizeObserver(() => syncWeb())
		ro.observe(el)
		requestAnimationFrame(() => syncWeb())

		let raf = 0,
			t0 = -1,
			paused = false

		function frame(now: number) {
			if (paused) {
				raf = 0
				return
			}
			raf = requestAnimationFrame(frame)
			if (!live) return
			const { cards, trigs, stamps, vignette, CW, CH, scale } = live
			if (CW <= 0 || CH <= 0 || vignette.width <= 0 || vignette.height <= 0) return
			if (stamps.some((s) => s.width <= 0 || s.height <= 0)) return
			if (t0 < 0) t0 = now
			drawFrame(ctx, (now - t0) / 1000, CW, CH, scale, cards, trigs, stamps, vignette)
		}

		function pause() {
			paused = true
			t0 = -1
		}
		function resume() {
			if (!paused) return
			paused = false
			raf = requestAnimationFrame(frame)
		}
		function onVis() {
			document.hidden ? pause() : resume()
		}

		document.addEventListener('visibilitychange', onVis)
		raf = requestAnimationFrame(frame)

		return {
			destroy() {
				cancelAnimationFrame(raf)
				cleanup()
				ro.disconnect()
				document.removeEventListener('visibilitychange', onVis)
			}
		}
	}
</script>

<canvas class="card-rain" use:mountCanvas aria-hidden="true"></canvas>

<style>
	.card-rain {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
