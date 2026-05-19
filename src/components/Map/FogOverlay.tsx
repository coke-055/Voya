import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { City } from '../../types'
import { getCountryGeometries } from '../../data/countryShapes'

interface Props {
  map: L.Map
  visitedCities: City[]
}

// ─── SVG feTurbulence cloud texture ───────────────────────────────────────────
const TEX_W = 2048
const TEX_H = 1024

function makeSvgUrl(): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TEX_W}" height="${TEX_H}">` +
    `<filter id="c" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.0035 0.0018" ` +
    `numOctaves="6" seed="42" stitchTiles="stitch" result="n"/>` +
    `<feColorMatrix in="n" type="matrix" ` +
    `values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 7 -3"/>` +
    `</filter>` +
    `<rect width="100%" height="100%" filter="url(#c)"/>` +
    `</svg>`
  return 'data:image/svg+xml;base64,' + btoa(svg)
}

// ─── Path helpers (add geometry rings to current path, no fill) ───────────────
function addGeoToPath(
  ctx: CanvasRenderingContext2D,
  geom: GeoJSON.Geometry,
  toPoint: (lat: number, lng: number) => { x: number; y: number }
) {
  const addRings = (rings: number[][][]) => {
    for (const ring of rings) {
      if (ring.length < 3) continue
      const [lng0, lat0] = ring[0]
      const p0 = toPoint(lat0, lng0)
      ctx.moveTo(p0.x, p0.y)
      for (let i = 1; i < ring.length; i++) {
        const [lng, lat] = ring[i]
        const p = toPoint(lat, lng)
        ctx.lineTo(p.x, p.y)
      }
      ctx.closePath()
    }
  }
  if (geom.type === 'Polygon')       addRings(geom.coordinates)
  else if (geom.type === 'MultiPolygon')
    for (const poly of geom.coordinates) addRings(poly)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FogOverlay({ map, visitedCities }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null)
  const offRef     = useRef<HTMLCanvasElement | null>(null)
  const cloudRef   = useRef<HTMLCanvasElement | null>(null)
  const visitedRef = useRef(visitedCities)
  const geomsRef   = useRef<Record<string, GeoJSON.Geometry>>({})
  const rafRef     = useRef(0)
  const startRef   = useRef(0)
  const sizeRef    = useRef({ w: 0, h: 0 })

  useEffect(() => { visitedRef.current = visitedCities }, [visitedCities])

  useEffect(() => {
    const codes = [...new Set(visitedCities.map((c) => c.countryCode).filter(Boolean))]
    if (codes.length === 0) return
    getCountryGeometries(codes).then((geoms) => {
      geomsRef.current = { ...geomsRef.current, ...geoms }
    })
  }, [visitedCities])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = TEX_W; c.height = TEX_H
      c.getContext('2d')!.drawImage(img, 0, 0)
      cloudRef.current = c
    }
    img.src = makeSvgUrl()
  }, [])

  function drawFrame(t: number) {
    const canvas = canvasRef.current
    const off    = offRef.current
    if (!canvas || !off) return

    const size = map.getSize()
    if (size.x !== sizeRef.current.w || size.y !== sizeRef.current.h) {
      canvas.width  = off.width  = size.x
      canvas.height = off.height = size.y
      sizeRef.current = { w: size.x, h: size.y }
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const origin = map.containerPointToLayerPoint([0, 0])
    canvas.style.transform = `translate3d(${origin.x}px,${origin.y}px,0)`

    const w = size.x, h = size.y
    const octx = off.getContext('2d')!
    octx.clearRect(0, 0, w, h)

    const zoom = map.getZoom()
    const toPoint = (lat: number, lng: number) =>
      map.latLngToContainerPoint([lat, lng])

    const visitedCodes = new Set(visitedRef.current.map((c) => c.countryCode))

    // ── Build clip path: entire canvas MINUS visited countries ──
    // Even-odd rule: pixels inside canvas rect (1 path) but also inside a country
    // polygon (2 paths) → even count → NOT filled → no fog there.
    octx.save()
    octx.beginPath()
    octx.rect(0, 0, w, h)   // outer boundary (fog everywhere)

    for (const code of visitedCodes) {
      const geom = geomsRef.current[code]
      if (geom) {
        // Add country polygon to path — even-odd will subtract it from fog
        addGeoToPath(octx, geom, toPoint)
      } else {
        // Fallback while geometry loads: large circle (≥500 km)
        const city = visitedRef.current.find((c) => c.countryCode === code)
        if (city) {
          const pt = toPoint(city.lat, city.lng)
          const r  = kmToPixels(500, city.lat, zoom)
          octx.moveTo(pt.x + r, pt.y)
          octx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
        }
      }
    }

    octx.clip('evenodd')  // restrict all drawing to fog area only

    // ── 1. Base sky ──
    octx.globalCompositeOperation = 'source-over'
    octx.fillStyle = 'rgba(140, 165, 210, 0.40)'
    octx.fillRect(0, 0, w, h)

    // ── 2. Animated cloud texture ──
    const cloud = cloudRef.current
    if (cloud) {
      const ox = Math.floor(t * 16) % TEX_W
      const oy = Math.floor(t *  4) % TEX_H
      octx.globalAlpha = 0.50
      for (let x = -ox; x < w; x += TEX_W)
        for (let y = -oy; y < h; y += TEX_H)
          octx.drawImage(cloud, x, y)
      octx.globalAlpha = 1
    }

    octx.restore()   // remove clip — visited countries remain transparent

    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(off, 0, 0)
  }

  useEffect(() => {
    const pane = map.getPane('overlayPane')
    if (!pane) return

    const canvas = document.createElement('canvas')
    canvas.style.position      = 'absolute'
    canvas.style.top           = '0'
    canvas.style.left          = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex        = '400'
    pane.appendChild(canvas)
    canvasRef.current = canvas
    offRef.current    = document.createElement('canvas')
    startRef.current  = performance.now()

    const loop = (now: number) => {
      drawFrame((now - startRef.current) / 1000)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.remove()
      canvasRef.current = null
      offRef.current    = null
    }
  }, [map])

  return null
}

function kmToPixels(km: number, lat: number, zoom: number): number {
  const m = (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom)
  return (km * 1000) / m
}
