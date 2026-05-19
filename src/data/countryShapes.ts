import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'

// ISO numeric → alpha2 mapping for all countries in our system
const NUM_TO_A2: Record<number, string> = {
  392: 'JP', 410: 'KR', 156: 'CN', 344: 'HK', 446: 'MO',
  764: 'TH', 704: 'VN', 702: 'SG', 458: 'MY', 360: 'ID',
  608: 'PH', 104: 'MM', 116: 'KH', 418: 'LA',
  356: 'IN', 144: 'LK', 524: 'NP',
  784: 'AE', 634: 'QA', 792: 'TR', 376: 'IL',
  826: 'GB', 250: 'FR', 276: 'DE', 528: 'NL',  56: 'BE',
  756: 'CH',  40: 'AT', 203: 'CZ', 348: 'HU', 616: 'PL',
  380: 'IT', 724: 'ES', 620: 'PT', 300: 'GR',
  208: 'DK', 752: 'SE', 578: 'NO', 246: 'FI', 352: 'IS',
  372: 'IE', 643: 'RU',
  840: 'US', 124: 'CA', 484: 'MX',  76: 'BR',  32: 'AR', 604: 'PE',
   36: 'AU', 554: 'NZ', 242: 'FJ',
  818: 'EG', 710: 'ZA', 404: 'KE', 504: 'MA',
  158: 'TW',
}

// Cache of alpha2 → GeoJSON geometry (lazy-loaded)
let cache: Record<string, GeoJSON.Geometry> | null = null

async function loadShapes(): Promise<Record<string, GeoJSON.Geometry>> {
  if (cache) return cache
  const worldData = await import('world-atlas/countries-50m.json')
  const topo = worldData.default as unknown as Topology
  const col = topo.objects.countries as GeometryCollection
  const fc = feature(topo, col)
  const result: Record<string, GeoJSON.Geometry> = {}
  for (const f of fc.features) {
    const numId = parseInt(f.id as string)
    const a2 = NUM_TO_A2[numId]
    if (a2 && f.geometry) result[a2] = f.geometry
  }
  cache = result
  return result
}

export async function getCountryGeometries(
  countryCodes: string[]
): Promise<Record<string, GeoJSON.Geometry>> {
  const shapes = await loadShapes()
  const result: Record<string, GeoJSON.Geometry> = {}
  for (const code of countryCodes) {
    if (shapes[code]) result[code] = shapes[code]
  }
  return result
}

// Draw a GeoJSON geometry as a filled path on a canvas context,
// converting geographic coords to screen pixels via the Leaflet map.
export function drawGeometryOnCanvas(
  ctx: CanvasRenderingContext2D,
  geom: GeoJSON.Geometry,
  latLngToPoint: (lat: number, lng: number) => { x: number; y: number }
) {
  if (geom.type === 'Polygon') {
    drawRings(ctx, geom.coordinates, latLngToPoint)
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) {
      drawRings(ctx, poly, latLngToPoint)
    }
  }
}

function drawRings(
  ctx: CanvasRenderingContext2D,
  rings: number[][][],
  latLngToPoint: (lat: number, lng: number) => { x: number; y: number }
) {
  for (const ring of rings) {
    if (ring.length < 3) continue
    ctx.beginPath()
    for (let i = 0; i < ring.length; i++) {
      const [lng, lat] = ring[i]
      const pt = latLngToPoint(lat, lng)
      if (i === 0) ctx.moveTo(pt.x, pt.y)
      else ctx.lineTo(pt.x, pt.y)
    }
    ctx.closePath()
    ctx.fill()
  }
}
