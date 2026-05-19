import { useRef, useState, useCallback, useEffect } from 'react'
import { X, Play, Download, Loader } from 'lucide-react'
import { Trip } from '../../types'
import { CITIES, COUNTRY_EMOJIS } from '../../data/cities'
import { greatCircleInterpolate, getBearing } from '../../utils/geoUtils'

interface Props {
  trips: Trip[]
  onClose: () => void
}

// ── Canvas dimensions (9:16 portrait like the reference) ─────────────────────
const W = 540
const H = 960
const FPS = 30

// ── Home base ─────────────────────────────────────────────────────────────────
const HOME = { lat: 25.033, lng: 121.565, name: '台灣', countryCode: 'TW' }

// ── Web-Mercator world tile map (zoom 3 = 8×8 tiles) ──────────────────────────
const ZOOM = 3
const N_TILES = Math.pow(2, ZOOM)   // 8
const TILE_PX = 256
const WORLD_PX = N_TILES * TILE_PX  // 2048

function lngToWx(lng: number) { return ((lng + 180) / 360) * WORLD_PX }
function latToWy(lat: number) {
  const r = (lat * Math.PI) / 180
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * WORLD_PX
}

// Camera: center + how many degrees of longitude are visible
interface Cam { lat: number; lng: number; degW: number }

function camSrc(cam: Cam) {
  const cx = lngToWx(cam.lng), cy = latToWy(cam.lat)
  const sw = (cam.degW / 360) * WORLD_PX
  const sh = sw * (H / W)
  return { sx: cx - sw / 2, sy: cy - sh / 2, sw, sh }
}

function worldToScreen(lat: number, lng: number, cam: Cam): [number, number] {
  const { sx, sy, sw, sh } = camSrc(cam)
  return [((lngToWx(lng) - sx) / sw) * W, ((latToWy(lat) - sy) / sh) * H]
}

function ease(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371, d2r = Math.PI / 180
  const dLat = (lat2 - lat1) * d2r, dLng = (lng2 - lng1) * d2r
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*d2r)*Math.cos(lat2*d2r)*Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// ── Tile loader ────────────────────────────────────────────────────────────────
async function loadWorldCanvas(): Promise<HTMLCanvasElement> {
  const c = document.createElement('canvas')
  c.width = c.height = WORLD_PX
  const ctx = c.getContext('2d')!
  // Dark ocean fallback
  ctx.fillStyle = '#0a1628'
  ctx.fillRect(0, 0, WORLD_PX, WORLD_PX)

  const jobs: Promise<void>[] = []
  for (let tx = 0; tx < N_TILES; tx++) {
    for (let ty = 0; ty < N_TILES; ty++) {
      jobs.push(new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => { ctx.drawImage(img, tx * TILE_PX, ty * TILE_PX, TILE_PX, TILE_PX); resolve() }
        img.onerror = () => resolve()
        img.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${ZOOM}/${ty}/${tx}`
      }))
    }
  }
  await Promise.all(jobs)
  return c
}

// ── Drawing helpers ────────────────────────────────────────────────────────────
function drawWorld(ctx: CanvasRenderingContext2D, world: HTMLCanvasElement, cam: Cam) {
  const { sx, sy, sw, sh } = camSrc(cam)
  ctx.drawImage(world, sx, sy, sw, sh, 0, 0, W, H)
  // Space gradient at top
  const grad = ctx.createLinearGradient(0, 0, 0, H * 0.35)
  grad.addColorStop(0, 'rgba(0,3,15,0.85)')
  grad.addColorStop(1, 'rgba(0,3,15,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  // Slight darkening overall
  ctx.fillStyle = 'rgba(0,8,30,0.25)'
  ctx.fillRect(0, 0, W, H)
}

function drawStars(ctx: CanvasRenderingContext2D, seed: number) {
  // Deterministic stars in the top portion
  let s = seed | 1
  const rnd = () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xffffffff }
  for (let i = 0; i < 60; i++) {
    const x = rnd() * W
    const y = rnd() * H * 0.30
    const r = 0.5 + rnd() * 1.2
    const a = 0.4 + rnd() * 0.6
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fill()
  }
}

function drawRouteLines(
  ctx: CanvasRenderingContext2D,
  segments: Array<{ from: { lat: number; lng: number }; to: { lat: number; lng: number }; progress: number }>,
  cam: Cam
) {
  for (const seg of segments) {
    const steps = 60
    const drawn = Math.floor(seg.progress * steps)
    if (drawn < 2) continue
    ctx.save()
    ctx.strokeStyle = 'rgba(100,180,255,0.75)'
    ctx.lineWidth = 2
    ctx.shadowColor = '#60b4ff'
    ctx.shadowBlur = 8
    ctx.beginPath()
    for (let i = 0; i <= drawn; i++) {
      const t = i / steps
      const [lat, lng] = greatCircleInterpolate(seg.from.lat, seg.from.lng, seg.to.lat, seg.to.lng, t)
      const [sx, sy] = worldToScreen(lat, lng, cam)
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)
    }
    ctx.stroke()
    ctx.restore()
  }
}

function drawPin(ctx: CanvasRenderingContext2D, x: number, y: number, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.shadowColor = '#60a5fa'
  ctx.shadowBlur = 14
  // Pin drop
  ctx.fillStyle = '#3b82f6'
  ctx.beginPath()
  ctx.arc(x, y - 14, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - 6, y - 10)
  ctx.lineTo(x + 6, y - 10)
  ctx.closePath()
  ctx.fill()
  // White dot
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(x, y - 14, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawCityCard(
  ctx: CanvasRenderingContext2D,
  cityName: string,
  countryName: string,
  flagEmoji: string,
  distanceKm: number,
  alpha: number
) {
  if (alpha <= 0) return
  ctx.save()
  ctx.globalAlpha = alpha

  const cardX = 28, cardY = H - 220, cardW = W - 56

  // Card background
  const bg = ctx.createLinearGradient(cardX, cardY, cardX, cardY + 160)
  bg.addColorStop(0, 'rgba(8,20,50,0.88)')
  bg.addColorStop(1, 'rgba(5,12,35,0.92)')
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, 160, 16)
  ctx.fill()
  // Border
  ctx.strokeStyle = 'rgba(96,165,250,0.35)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Flag
  ctx.font = '40px serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(flagEmoji, cardX + 20, cardY + 44)

  // City name
  ctx.font = 'bold 32px system-ui, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(cityName, cardX + 20, cardY + 90)

  // Country name
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillStyle = 'rgba(180,200,240,0.85)'
  ctx.fillText(countryName, cardX + 20, cardY + 116)

  // Distance badge
  if (distanceKm > 0) {
    const km = Math.round(distanceKm).toLocaleString()
    const badgeText = `+${km} km`
    ctx.font = 'bold 14px system-ui, sans-serif'
    const bw = ctx.measureText(badgeText).width + 20
    const bx = cardX + cardW - bw - 16, by = cardY + 16
    ctx.fillStyle = 'rgba(59,130,246,0.85)'
    ctx.beginPath()
    ctx.roundRect(bx, by, bw, 26, 13)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(badgeText, bx + bw / 2, by + 13)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
  }

  ctx.restore()
}

function drawBottomBar(ctx: CanvasRenderingContext2D, year: number, tripCount: number, totalKm: number) {
  ctx.save()
  const barH = 72
  const grad = ctx.createLinearGradient(0, H - barH, 0, H)
  grad.addColorStop(0, 'rgba(5,12,35,0.90)')
  grad.addColorStop(1, 'rgba(2,8,25,0.98)')
  ctx.fillStyle = grad
  ctx.fillRect(0, H - barH, W, barH)

  ctx.font = 'bold 22px system-ui, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(`My ${year}`, 28, H - barH / 2)

  // Icons + stats
  const stats = [`✈️ ${tripCount}趟`, `🗺️ ${Math.round(totalKm / 1000)}k km`]
  ctx.font = '15px system-ui, sans-serif'
  ctx.fillStyle = 'rgba(160,190,240,0.90)'
  let rx = W - 28
  for (const s of stats.reverse()) {
    const sw = ctx.measureText(s).width
    rx -= sw
    ctx.fillText(s, rx, H - barH / 2)
    rx -= 18
  }
  ctx.restore()
}

function drawWatermark(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.globalAlpha = 0.72
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.textBaseline = 'top'
  ctx.textAlign = 'right'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.6)'
  ctx.shadowBlur = 6
  ctx.fillText('Voya ✈️', W - 16, 18)
  ctx.restore()
}

function drawArrivalCityLabel(
  ctx: CanvasRenderingContext2D,
  cityName: string,
  x: number,
  y: number,
  alpha: number
) {
  if (alpha <= 0) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  const pad = 8
  const metrics = ctx.measureText(cityName)
  const bw = metrics.width + pad * 2
  const bh = 22
  const bx = x - bw / 2
  const by = y - 38 - bh  // float above the pin head

  ctx.fillStyle = 'rgba(8,20,50,0.82)'
  ctx.beginPath()
  ctx.roundRect(bx, by, bw, bh, 6)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.fillText(cityName, x, by + bh)
  ctx.restore()
}

// ─── Component ─────────────────────────────────────────────────────────────────
type Status = 'loading' | 'idle' | 'rendering' | 'done' | 'error'

export default function AnimationExporter({ trips, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef  = useRef<HTMLCanvasElement | null>(null)
  const [status, setStatus]   = useState<Status>('loading')
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError]     = useState('')
  const abortRef = useRef(false)

  const sortedTrips = [...trips]
    .filter((t) => t.endDate <= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  // Load world tiles on mount
  useEffect(() => {
    loadWorldCanvas().then((c) => {
      worldRef.current = c
      setStatus('idle')
    })
  }, [])

  const getCityCoords = (trip: Trip) => {
    const city = CITIES.find((c) => c.name === trip.cities[0])
    if (city) return city
    return CITIES.find((c) => c.countryCode === trip.countryCode) ?? null
  }

  const renderAnimation = useCallback(async () => {
    const canvas = canvasRef.current
    const world  = worldRef.current
    if (!canvas || !world) return
    const ctx = canvas.getContext('2d')!
    abortRef.current = false
    setStatus('rendering')
    setProgress(0)
    setError('')

    if (sortedTrips.length === 0) {
      setError('沒有可製作動畫的歷史行程')
      setStatus('error')
      return
    }

    // Build waypoints: Home → city1 → Home → city2 → …
    type WP = { lat: number; lng: number; name: string; country: string; code: string; isHome: boolean; trip: Trip | null }
    const wps: WP[] = [{
      lat: HOME.lat, lng: HOME.lng,
      name: '台灣', country: 'Taiwan', code: 'TW',
      isHome: true, trip: null,
    }]
    for (const trip of sortedTrips) {
      const city = getCityCoords(trip)
      if (!city) continue
      wps.push({
        lat: city.lat, lng: city.lng,
        name: city.nameZh ?? city.name,
        country: city.country,
        code: trip.countryCode,
        isHome: false, trip,
      })
      wps.push({ lat: HOME.lat, lng: HOME.lng, name: '台灣', country: 'Taiwan', code: 'TW', isHome: true, trip: null })
    }

    const SEC_PER_SEG = 10.5
    const totalSec = wps.length * SEC_PER_SEG
    const totalFrames = Math.ceil(totalSec * FPS)
    const framesPerSeg = Math.ceil(SEC_PER_SEG * FPS)

    // Total km for branding
    let totalKm = 0
    for (let i = 1; i < wps.length; i++)
      totalKm += haversineKm(wps[i-1].lat, wps[i-1].lng, wps[i].lat, wps[i].lng)

    // MediaRecorder setup
    const stream = canvas.captureStream(FPS)
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9' : 'video/webm'
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 })
    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
    const done = new Promise<void>((res) => { recorder.onstop = () => res() })
    recorder.start()

    // Completed route lines
    type RouteSeg = { from: { lat: number; lng: number }; to: { lat: number; lng: number }; progress: number }
    const completedRoutes: RouteSeg[] = []
    const currentRoute: RouteSeg = { from: wps[0], to: wps[0], progress: 0 }

    for (let frame = 0; frame < totalFrames; frame++) {
      if (abortRef.current) break

      const segIdx = Math.min(Math.floor(frame / framesPerSeg), wps.length - 2)
      const segT   = (frame - segIdx * framesPerSeg) / framesPerSeg
      const from   = wps[segIdx]
      const to     = wps[segIdx + 1] ?? wps[segIdx]

      // Current flight position
      const tEased = ease(Math.min(segT, 1))
      const [planeLat, planeLng] = greatCircleInterpolate(from.lat, from.lng, to.lat, to.lng, tEased)
      const bearing = getBearing(from.lat, from.lng, to.lat, to.lng)

      // Camera: during flight zoom out, on arrival zoom in
      const midZoom = Math.max(
        Math.abs(to.lng - from.lng) * 0.9 + 25,
        Math.abs(to.lat - from.lat) * 1.4 + 25
      )
      let camDegW: number
      let camLat: number, camLng: number
      if (segT < 0.5) {
        // Flying out → zoom out, follow midpoint
        const t2 = segT / 0.5
        camDegW = lerp(20, midZoom, ease(t2))
        camLat  = lerp(from.lat, (from.lat + to.lat) / 2, ease(t2))
        camLng  = lerp(from.lng, (from.lng + to.lng) / 2, ease(t2))
      } else {
        // Arriving → zoom in to destination
        const t2 = (segT - 0.5) / 0.5
        camDegW = lerp(midZoom, 20, ease(t2))
        camLat  = lerp((from.lat + to.lat) / 2, to.lat, ease(t2))
        camLng  = lerp((from.lng + to.lng) / 2, to.lng, ease(t2))
      }
      const cam: Cam = { lat: camLat, lng: camLng, degW: Math.max(camDegW, 12) }

      // Update route tracking
      currentRoute.from     = from
      currentRoute.to       = to
      currentRoute.progress = segT

      // Card fade-in near arrival
      const cardAlpha = segT > 0.75 ? Math.min((segT - 0.75) / 0.15, 1) : 0
      const distKm = haversineKm(from.lat, from.lng, to.lat, to.lng)

      // ── Draw frame ──
      ctx.clearRect(0, 0, W, H)
      drawWorld(ctx, world, cam)
      drawStars(ctx, 0xdeadbeef)

      // All completed routes
      for (const r of completedRoutes) drawRouteLines(ctx, [r], cam)
      // Current route
      drawRouteLines(ctx, [currentRoute], cam)

      // Destination pins
      for (const wp of wps.slice(0, segIdx + 1)) {
        if (!wp.isHome) {
          const [px, py] = worldToScreen(wp.lat, wp.lng, cam)
          if (px > 0 && px < W && py > 0 && py < H) drawPin(ctx, px, py)
        }
      }

      // Airplane
      const [planeX, planeY] = worldToScreen(planeLat, planeLng, cam)
      drawAirplane(ctx, planeX, planeY, bearing, cam)

      // City card
      if (!to.isHome) {
        drawCityCard(ctx,
          to.name, to.country,
          COUNTRY_EMOJIS[to.code] ?? '🌍',
          distKm,
          cardAlpha
        )
      }

      drawBottomBar(ctx, new Date().getFullYear(), sortedTrips.length, totalKm)
      drawWatermark(ctx)

      // Arrival city label — floats above destination pin when zooming in
      if (!to.isHome && cardAlpha > 0) {
        const [px, py] = worldToScreen(to.lat, to.lng, cam)
        if (px > 0 && px < W && py > 0 && py < H) {
          drawArrivalCityLabel(ctx, to.name, px, py, cardAlpha)
        }
      }

      // Mark route as completed
      if (segT > 0.98 && !completedRoutes.some(r => r.from === from && r.to === to)) {
        completedRoutes.push({ from, to, progress: 1 })
      }

      setProgress(Math.round((frame / totalFrames) * 100))
      if (frame % 4 === 0) await new Promise((r) => requestAnimationFrame(r))
    }

    // ── 1-second end screen ──────────────────────────────────────────────────
    const END_FRAMES = FPS  // 30 frames = 1 second
    for (let f = 0; f < END_FRAMES; f++) {
      if (abortRef.current) break
      const t = f / END_FRAMES

      ctx.clearRect(0, 0, W, H)

      // Deep-space background
      ctx.fillStyle = '#020810'
      ctx.fillRect(0, 0, W, H)

      // Subtle radial glow behind logo
      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 220)
      glow.addColorStop(0, 'rgba(59,130,246,0.18)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // Stars
      drawStars(ctx, 0xdeadbeef)

      // Fade in
      const alpha = Math.min(t / 0.35, 1)
      ctx.save()
      ctx.globalAlpha = alpha

      // App name
      ctx.font = 'bold 72px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#3b82f6'
      ctx.shadowBlur = 30
      ctx.fillText('Voya', W / 2, H / 2 - 24)

      // Plane icon (drawn, same style as animation plane)
      ctx.shadowBlur = 0
      ctx.save()
      ctx.translate(W / 2, H / 2 + 48)
      ctx.fillStyle = '#dbeafe'
      ctx.shadowColor = '#60a5fa'
      ctx.shadowBlur = 12
      ctx.scale(1.6, 1.6)
      ctx.beginPath()
      ctx.moveTo(22,0); ctx.bezierCurveTo(20,-3.5,2,-4,-18,-3.2)
      ctx.lineTo(-23,0); ctx.bezierCurveTo(-18,3.2,2,4,20,3.5); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(5,3.2); ctx.lineTo(-5,3.2); ctx.lineTo(-16,20); ctx.lineTo(-8,20); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(5,-3.2); ctx.lineTo(-5,-3.2); ctx.lineTo(-16,-20); ctx.lineTo(-8,-20); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(-14,2.5); ctx.lineTo(-18,2.5); ctx.lineTo(-23,9); ctx.lineTo(-20,9); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(-14,-2.5); ctx.lineTo(-18,-2.5); ctx.lineTo(-23,-9); ctx.lineTo(-20,-9); ctx.closePath(); ctx.fill()
      ctx.restore()

      // Tagline
      ctx.font = '16px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(160,190,240,0.80)'
      ctx.shadowBlur = 0
      ctx.fillText('記錄你走過的每一片土地', W / 2, H / 2 + 96)

      ctx.restore()

      setProgress(Math.round(((totalFrames + f) / (totalFrames + END_FRAMES)) * 100))
      await new Promise((r) => requestAnimationFrame(r))
    }

    recorder.stop()
    await done

    const blob = new Blob(chunks, { type: 'video/webm' })
    setVideoUrl(URL.createObjectURL(blob))
    setStatus('done')
    setProgress(100)
  }, [sortedTrips])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">✈️ 生成旅遊動畫</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Preview canvas — 9:16 portrait */}
          <div className="relative bg-gray-950 rounded-xl overflow-hidden mx-auto"
            style={{ width: '100%', maxWidth: 270, aspectRatio: '9/16' }}>
            <canvas
              ref={canvasRef}
              width={W} height={H}
              className="w-full h-full object-cover"
            />
            {status === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
                <Loader size={28} className="animate-spin" />
                <span className="text-xs">載入衛星圖資中…</span>
              </div>
            )}
            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-600 text-sm text-center px-4">
                  點擊「生成動畫」<br/>
                  <span className="text-xs text-gray-700">{sortedTrips.length} 趟行程</span>
                </span>
              </div>
            )}
            {status === 'rendering' && (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-1 bg-gray-800">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-center text-gray-400 py-1">渲染中 {progress}%</p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400 bg-red-900/20 rounded-xl p-3">{error}</p>}

          <div className="flex gap-3">
            {status !== 'rendering' && status !== 'loading' && (
              <button
                onClick={renderAnimation}
                disabled={sortedTrips.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium disabled:opacity-40"
              >
                <Play size={15} /> 生成動畫
              </button>
            )}
            {status === 'rendering' && (
              <button
                onClick={() => { abortRef.current = true; setStatus('idle') }}
                className="flex-1 py-2.5 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl text-sm"
              >
                取消
              </button>
            )}
            {status === 'done' && videoUrl && (
              <button
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = videoUrl
                  a.download = `voya-${new Date().getFullYear()}.webm`
                  a.click()
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium"
              >
                <Download size={15} /> 下載影片 (.webm)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Airplane sprite (top-down view) ───────────────────────────────────────────
function drawAirplane(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  bearing: number,
  _cam: Cam
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(((bearing - 90) * Math.PI) / 180)

  ctx.fillStyle = '#dbeafe'
  ctx.shadowColor = '#60a5fa'
  ctx.shadowBlur = 18

  // Fuselage
  ctx.beginPath()
  ctx.moveTo(22, 0)
  ctx.bezierCurveTo(20, -3.5,  2, -4, -18, -3.2)
  ctx.lineTo(-23, 0)
  ctx.bezierCurveTo(-18,  3.2, 2,  4,  20,  3.5)
  ctx.closePath()
  ctx.fill()

  // Main wings
  ctx.beginPath()
  ctx.moveTo( 5,  3.2); ctx.lineTo(-5,  3.2)
  ctx.lineTo(-16, 20);  ctx.lineTo(-8,  20)
  ctx.closePath(); ctx.fill()

  ctx.beginPath()
  ctx.moveTo( 5, -3.2); ctx.lineTo(-5, -3.2)
  ctx.lineTo(-16, -20); ctx.lineTo(-8, -20)
  ctx.closePath(); ctx.fill()

  // Tail fins
  ctx.beginPath()
  ctx.moveTo(-14,  2.5); ctx.lineTo(-18,  2.5)
  ctx.lineTo(-23, 9);    ctx.lineTo(-20, 9)
  ctx.closePath(); ctx.fill()

  ctx.beginPath()
  ctx.moveTo(-14, -2.5); ctx.lineTo(-18, -2.5)
  ctx.lineTo(-23, -9);   ctx.lineTo(-20, -9)
  ctx.closePath(); ctx.fill()

  // Engine pods
  ctx.globalAlpha = 0.82
  ctx.beginPath(); ctx.ellipse(-3,  13, 5.5, 2, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(-3, -13, 5.5, 2, 0, 0, Math.PI * 2); ctx.fill()

  ctx.restore()
}
