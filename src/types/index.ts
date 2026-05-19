export interface City {
  name: string
  nameZh: string
  country: string
  countryCode: string
  lat: number
  lng: number
  radiusKm: number // fog clearing radius
}

export interface Trip {
  id: string
  title: string
  startDate: string // ISO date string
  endDate: string
  country: string
  countryCode: string
  cities: string[] // city names matching City.name
  notes: string
  coverEmoji: string
}

export interface ParsedTripDates {
  startDate: string
  endDate: string
}
