import { City } from '../types'

// radiusKm: visual fog-clearing radius for the city
export const CITIES: City[] = [
  // East Asia
  { name: 'Tokyo', nameZh: '東京', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503, radiusKm: 35 },
  { name: 'Osaka', nameZh: '大阪', country: 'Japan', countryCode: 'JP', lat: 34.6937, lng: 135.5023, radiusKm: 25 },
  { name: 'Kyoto', nameZh: '京都', country: 'Japan', countryCode: 'JP', lat: 35.0116, lng: 135.7681, radiusKm: 18 },
  { name: 'Sapporo', nameZh: '札幌', country: 'Japan', countryCode: 'JP', lat: 43.0618, lng: 141.3545, radiusKm: 20 },
  { name: 'Fukuoka', nameZh: '福岡', country: 'Japan', countryCode: 'JP', lat: 33.5904, lng: 130.4017, radiusKm: 18 },
  { name: 'Naha', nameZh: '那霸', country: 'Japan', countryCode: 'JP', lat: 26.2124, lng: 127.6809, radiusKm: 15 },
  { name: 'Nagoya', nameZh: '名古屋', country: 'Japan', countryCode: 'JP', lat: 35.1815, lng: 136.9066, radiusKm: 20 },
  { name: 'Seoul', nameZh: '首爾', country: 'South Korea', countryCode: 'KR', lat: 37.5665, lng: 126.9780, radiusKm: 30 },
  { name: 'Busan', nameZh: '釜山', country: 'South Korea', countryCode: 'KR', lat: 35.1796, lng: 129.0756, radiusKm: 20 },
  { name: 'Jeju', nameZh: '濟州', country: 'South Korea', countryCode: 'KR', lat: 33.4996, lng: 126.5312, radiusKm: 18 },
  { name: 'Beijing', nameZh: '北京', country: 'China', countryCode: 'CN', lat: 39.9042, lng: 116.4074, radiusKm: 40 },
  { name: 'Shanghai', nameZh: '上海', country: 'China', countryCode: 'CN', lat: 31.2304, lng: 121.4737, radiusKm: 35 },
  { name: 'Guangzhou', nameZh: '廣州', country: 'China', countryCode: 'CN', lat: 23.1291, lng: 113.2644, radiusKm: 30 },
  { name: 'Shenzhen', nameZh: '深圳', country: 'China', countryCode: 'CN', lat: 22.5431, lng: 114.0579, radiusKm: 25 },
  { name: 'Chengdu', nameZh: '成都', country: 'China', countryCode: 'CN', lat: 30.5728, lng: 104.0668, radiusKm: 28 },
  { name: 'Xi\'an', nameZh: '西安', country: 'China', countryCode: 'CN', lat: 34.3416, lng: 108.9398, radiusKm: 25 },
  { name: 'Hong Kong', nameZh: '香港', country: 'Hong Kong', countryCode: 'HK', lat: 22.3193, lng: 114.1694, radiusKm: 20 },
  { name: 'Macau', nameZh: '澳門', country: 'Macau', countryCode: 'MO', lat: 22.1987, lng: 113.5439, radiusKm: 10 },

  // Southeast Asia
  { name: 'Bangkok', nameZh: '曼谷', country: 'Thailand', countryCode: 'TH', lat: 13.7563, lng: 100.5018, radiusKm: 35 },
  { name: 'Chiang Mai', nameZh: '清邁', country: 'Thailand', countryCode: 'TH', lat: 18.7883, lng: 98.9853, radiusKm: 18 },
  { name: 'Phuket', nameZh: '普吉', country: 'Thailand', countryCode: 'TH', lat: 7.8804, lng: 98.3923, radiusKm: 22 },
  { name: 'Pattaya', nameZh: '芭達雅', country: 'Thailand', countryCode: 'TH', lat: 12.9236, lng: 100.8825, radiusKm: 15 },
  { name: 'Hanoi', nameZh: '河內', country: 'Vietnam', countryCode: 'VN', lat: 21.0285, lng: 105.8542, radiusKm: 25 },
  { name: 'Ho Chi Minh City', nameZh: '胡志明市', country: 'Vietnam', countryCode: 'VN', lat: 10.8231, lng: 106.6297, radiusKm: 28 },
  { name: 'Da Nang', nameZh: '岘港', country: 'Vietnam', countryCode: 'VN', lat: 16.0544, lng: 108.2022, radiusKm: 18 },
  { name: 'Hoi An', nameZh: '會安', country: 'Vietnam', countryCode: 'VN', lat: 15.8800, lng: 108.3380, radiusKm: 10 },
  { name: 'Singapore', nameZh: '新加坡', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lng: 103.8198, radiusKm: 20 },
  { name: 'Kuala Lumpur', nameZh: '吉隆坡', country: 'Malaysia', countryCode: 'MY', lat: 3.1390, lng: 101.6869, radiusKm: 28 },
  { name: 'Penang', nameZh: '檳城', country: 'Malaysia', countryCode: 'MY', lat: 5.4141, lng: 100.3288, radiusKm: 18 },
  { name: 'Bali', nameZh: '峇里島', country: 'Indonesia', countryCode: 'ID', lat: -8.3405, lng: 115.0920, radiusKm: 30 },
  { name: 'Jakarta', nameZh: '雅加達', country: 'Indonesia', countryCode: 'ID', lat: -6.2088, lng: 106.8456, radiusKm: 35 },
  { name: 'Manila', nameZh: '馬尼拉', country: 'Philippines', countryCode: 'PH', lat: 14.5995, lng: 120.9842, radiusKm: 25 },
  { name: 'Cebu', nameZh: '宿霧', country: 'Philippines', countryCode: 'PH', lat: 10.3157, lng: 123.8854, radiusKm: 18 },
  { name: 'Yangon', nameZh: '仰光', country: 'Myanmar', countryCode: 'MM', lat: 16.8661, lng: 96.1951, radiusKm: 22 },
  { name: 'Phnom Penh', nameZh: '金邊', country: 'Cambodia', countryCode: 'KH', lat: 11.5564, lng: 104.9282, radiusKm: 20 },
  { name: 'Siem Reap', nameZh: '暹粒', country: 'Cambodia', countryCode: 'KH', lat: 13.3671, lng: 103.8448, radiusKm: 15 },
  { name: 'Vientiane', nameZh: '永珍', country: 'Laos', countryCode: 'LA', lat: 17.9757, lng: 102.6331, radiusKm: 15 },

  // South Asia
  { name: 'Mumbai', nameZh: '孟買', country: 'India', countryCode: 'IN', lat: 19.0760, lng: 72.8777, radiusKm: 35 },
  { name: 'Delhi', nameZh: '德里', country: 'India', countryCode: 'IN', lat: 28.6139, lng: 77.2090, radiusKm: 35 },
  { name: 'Bangalore', nameZh: '班加羅爾', country: 'India', countryCode: 'IN', lat: 12.9716, lng: 77.5946, radiusKm: 28 },
  { name: 'Goa', nameZh: '果阿', country: 'India', countryCode: 'IN', lat: 15.2993, lng: 74.1240, radiusKm: 20 },
  { name: 'Colombo', nameZh: '可倫坡', country: 'Sri Lanka', countryCode: 'LK', lat: 6.9271, lng: 79.8612, radiusKm: 18 },
  { name: 'Kathmandu', nameZh: '加德滿都', country: 'Nepal', countryCode: 'NP', lat: 27.7172, lng: 85.3240, radiusKm: 18 },

  // Middle East
  { name: 'Dubai', nameZh: '杜拜', country: 'UAE', countryCode: 'AE', lat: 25.2048, lng: 55.2708, radiusKm: 30 },
  { name: 'Abu Dhabi', nameZh: '阿布達比', country: 'UAE', countryCode: 'AE', lat: 24.4539, lng: 54.3773, radiusKm: 25 },
  { name: 'Doha', nameZh: '多哈', country: 'Qatar', countryCode: 'QA', lat: 25.2854, lng: 51.5310, radiusKm: 22 },
  { name: 'Istanbul', nameZh: '伊斯坦堡', country: 'Turkey', countryCode: 'TR', lat: 41.0082, lng: 28.9784, radiusKm: 35 },
  { name: 'Tel Aviv', nameZh: '特拉維夫', country: 'Israel', countryCode: 'IL', lat: 32.0853, lng: 34.7818, radiusKm: 18 },

  // Europe
  { name: 'London', nameZh: '倫敦', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, radiusKm: 40 },
  { name: 'Edinburgh', nameZh: '愛丁堡', country: 'United Kingdom', countryCode: 'GB', lat: 55.9533, lng: -3.1883, radiusKm: 18 },
  { name: 'Paris', nameZh: '巴黎', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, radiusKm: 35 },
  { name: 'Nice', nameZh: '尼斯', country: 'France', countryCode: 'FR', lat: 43.7102, lng: 7.2620, radiusKm: 15 },
  { name: 'Lyon', nameZh: '里昂', country: 'France', countryCode: 'FR', lat: 45.7640, lng: 4.8357, radiusKm: 18 },
  { name: 'Berlin', nameZh: '柏林', country: 'Germany', countryCode: 'DE', lat: 52.5200, lng: 13.4050, radiusKm: 35 },
  { name: 'Munich', nameZh: '慕尼黑', country: 'Germany', countryCode: 'DE', lat: 48.1351, lng: 11.5820, radiusKm: 25 },
  { name: 'Frankfurt', nameZh: '法蘭克福', country: 'Germany', countryCode: 'DE', lat: 50.1109, lng: 8.6821, radiusKm: 22 },
  { name: 'Amsterdam', nameZh: '阿姆斯特丹', country: 'Netherlands', countryCode: 'NL', lat: 52.3676, lng: 4.9041, radiusKm: 22 },
  { name: 'Brussels', nameZh: '布魯塞爾', country: 'Belgium', countryCode: 'BE', lat: 50.8503, lng: 4.3517, radiusKm: 20 },
  { name: 'Zurich', nameZh: '蘇黎世', country: 'Switzerland', countryCode: 'CH', lat: 47.3769, lng: 8.5417, radiusKm: 18 },
  { name: 'Geneva', nameZh: '日內瓦', country: 'Switzerland', countryCode: 'CH', lat: 46.2044, lng: 6.1432, radiusKm: 15 },
  { name: 'Vienna', nameZh: '維也納', country: 'Austria', countryCode: 'AT', lat: 48.2082, lng: 16.3738, radiusKm: 25 },
  { name: 'Prague', nameZh: '布拉格', country: 'Czech Republic', countryCode: 'CZ', lat: 50.0755, lng: 14.4378, radiusKm: 20 },
  { name: 'Budapest', nameZh: '布達佩斯', country: 'Hungary', countryCode: 'HU', lat: 47.4979, lng: 19.0402, radiusKm: 22 },
  { name: 'Warsaw', nameZh: '華沙', country: 'Poland', countryCode: 'PL', lat: 52.2297, lng: 21.0122, radiusKm: 25 },
  { name: 'Rome', nameZh: '羅馬', country: 'Italy', countryCode: 'IT', lat: 41.9028, lng: 12.4964, radiusKm: 30 },
  { name: 'Milan', nameZh: '米蘭', country: 'Italy', countryCode: 'IT', lat: 45.4642, lng: 9.1900, radiusKm: 25 },
  { name: 'Venice', nameZh: '威尼斯', country: 'Italy', countryCode: 'IT', lat: 45.4408, lng: 12.3155, radiusKm: 15 },
  { name: 'Florence', nameZh: '佛羅倫斯', country: 'Italy', countryCode: 'IT', lat: 43.7696, lng: 11.2558, radiusKm: 15 },
  { name: 'Barcelona', nameZh: '巴塞隆納', country: 'Spain', countryCode: 'ES', lat: 41.3851, lng: 2.1734, radiusKm: 25 },
  { name: 'Madrid', nameZh: '馬德里', country: 'Spain', countryCode: 'ES', lat: 40.4168, lng: -3.7038, radiusKm: 28 },
  { name: 'Seville', nameZh: '塞維亞', country: 'Spain', countryCode: 'ES', lat: 37.3891, lng: -5.9845, radiusKm: 18 },
  { name: 'Lisbon', nameZh: '里斯本', country: 'Portugal', countryCode: 'PT', lat: 38.7223, lng: -9.1393, radiusKm: 22 },
  { name: 'Athens', nameZh: '雅典', country: 'Greece', countryCode: 'GR', lat: 37.9838, lng: 23.7275, radiusKm: 25 },
  { name: 'Santorini', nameZh: '聖托里尼', country: 'Greece', countryCode: 'GR', lat: 36.3932, lng: 25.4615, radiusKm: 12 },
  { name: 'Mykonos', nameZh: '米科諾斯', country: 'Greece', countryCode: 'GR', lat: 37.4467, lng: 25.3289, radiusKm: 10 },
  { name: 'Copenhagen', nameZh: '哥本哈根', country: 'Denmark', countryCode: 'DK', lat: 55.6761, lng: 12.5683, radiusKm: 22 },
  { name: 'Stockholm', nameZh: '斯德哥爾摩', country: 'Sweden', countryCode: 'SE', lat: 59.3293, lng: 18.0686, radiusKm: 25 },
  { name: 'Oslo', nameZh: '奧斯陸', country: 'Norway', countryCode: 'NO', lat: 59.9139, lng: 10.7522, radiusKm: 22 },
  { name: 'Helsinki', nameZh: '赫爾辛基', country: 'Finland', countryCode: 'FI', lat: 60.1699, lng: 24.9384, radiusKm: 22 },
  { name: 'Reykjavik', nameZh: '雷克雅維克', country: 'Iceland', countryCode: 'IS', lat: 64.1265, lng: -21.8174, radiusKm: 15 },
  { name: 'Dublin', nameZh: '都柏林', country: 'Ireland', countryCode: 'IE', lat: 53.3498, lng: -6.2603, radiusKm: 20 },
  { name: 'Moscow', nameZh: '莫斯科', country: 'Russia', countryCode: 'RU', lat: 55.7558, lng: 37.6173, radiusKm: 40 },
  { name: 'St. Petersburg', nameZh: '聖彼得堡', country: 'Russia', countryCode: 'RU', lat: 59.9311, lng: 30.3609, radiusKm: 28 },

  // Americas
  { name: 'New York', nameZh: '紐約', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060, radiusKm: 35 },
  { name: 'Los Angeles', nameZh: '洛杉磯', country: 'United States', countryCode: 'US', lat: 34.0522, lng: -118.2437, radiusKm: 40 },
  { name: 'San Francisco', nameZh: '舊金山', country: 'United States', countryCode: 'US', lat: 37.7749, lng: -122.4194, radiusKm: 25 },
  { name: 'Las Vegas', nameZh: '拉斯維加斯', country: 'United States', countryCode: 'US', lat: 36.1699, lng: -115.1398, radiusKm: 22 },
  { name: 'Chicago', nameZh: '芝加哥', country: 'United States', countryCode: 'US', lat: 41.8781, lng: -87.6298, radiusKm: 30 },
  { name: 'Seattle', nameZh: '西雅圖', country: 'United States', countryCode: 'US', lat: 47.6062, lng: -122.3321, radiusKm: 22 },
  { name: 'Miami', nameZh: '邁阿密', country: 'United States', countryCode: 'US', lat: 25.7617, lng: -80.1918, radiusKm: 22 },
  { name: 'Boston', nameZh: '波士頓', country: 'United States', countryCode: 'US', lat: 42.3601, lng: -71.0589, radiusKm: 22 },
  { name: 'Washington D.C.', nameZh: '華盛頓特區', country: 'United States', countryCode: 'US', lat: 38.9072, lng: -77.0369, radiusKm: 22 },
  { name: 'Honolulu', nameZh: '火奴魯魯', country: 'United States', countryCode: 'US', lat: 21.3069, lng: -157.8583, radiusKm: 18 },
  { name: 'Toronto', nameZh: '多倫多', country: 'Canada', countryCode: 'CA', lat: 43.6532, lng: -79.3832, radiusKm: 30 },
  { name: 'Vancouver', nameZh: '溫哥華', country: 'Canada', countryCode: 'CA', lat: 49.2827, lng: -123.1207, radiusKm: 25 },
  { name: 'Montreal', nameZh: '蒙特婁', country: 'Canada', countryCode: 'CA', lat: 45.5017, lng: -73.5673, radiusKm: 25 },
  { name: 'Mexico City', nameZh: '墨西哥城', country: 'Mexico', countryCode: 'MX', lat: 19.4326, lng: -99.1332, radiusKm: 40 },
  { name: 'Cancun', nameZh: '坎昆', country: 'Mexico', countryCode: 'MX', lat: 21.1619, lng: -86.8515, radiusKm: 18 },
  { name: 'Sao Paulo', nameZh: '聖保羅', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lng: -46.6333, radiusKm: 40 },
  { name: 'Rio de Janeiro', nameZh: '里約熱內盧', country: 'Brazil', countryCode: 'BR', lat: -22.9068, lng: -43.1729, radiusKm: 30 },
  { name: 'Buenos Aires', nameZh: '布宜諾斯艾利斯', country: 'Argentina', countryCode: 'AR', lat: -34.6037, lng: -58.3816, radiusKm: 35 },
  { name: 'Lima', nameZh: '利馬', country: 'Peru', countryCode: 'PE', lat: -12.0464, lng: -77.0428, radiusKm: 28 },
  { name: 'Cusco', nameZh: '庫斯科', country: 'Peru', countryCode: 'PE', lat: -13.5319, lng: -71.9675, radiusKm: 15 },

  // Oceania
  { name: 'Sydney', nameZh: '雪梨', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093, radiusKm: 35 },
  { name: 'Melbourne', nameZh: '墨爾本', country: 'Australia', countryCode: 'AU', lat: -37.8136, lng: 144.9631, radiusKm: 30 },
  { name: 'Brisbane', nameZh: '布里斯本', country: 'Australia', countryCode: 'AU', lat: -27.4698, lng: 153.0251, radiusKm: 25 },
  { name: 'Gold Coast', nameZh: '黃金海岸', country: 'Australia', countryCode: 'AU', lat: -28.0167, lng: 153.4000, radiusKm: 20 },
  { name: 'Cairns', nameZh: '凱恩斯', country: 'Australia', countryCode: 'AU', lat: -16.9186, lng: 145.7781, radiusKm: 15 },
  { name: 'Auckland', nameZh: '奧克蘭', country: 'New Zealand', countryCode: 'NZ', lat: -36.8509, lng: 174.7645, radiusKm: 22 },
  { name: 'Queenstown', nameZh: '皇后鎮', country: 'New Zealand', countryCode: 'NZ', lat: -45.0312, lng: 168.6626, radiusKm: 12 },
  { name: 'Nadi', nameZh: '南迪', country: 'Fiji', countryCode: 'FJ', lat: -17.7765, lng: 177.4356, radiusKm: 15 },

  // Africa
  { name: 'Cairo', nameZh: '開羅', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, radiusKm: 35 },
  { name: 'Cape Town', nameZh: '開普敦', country: 'South Africa', countryCode: 'ZA', lat: -33.9249, lng: 18.4241, radiusKm: 25 },
  { name: 'Johannesburg', nameZh: '約翰尼斯堡', country: 'South Africa', countryCode: 'ZA', lat: -26.2041, lng: 28.0473, radiusKm: 30 },
  { name: 'Nairobi', nameZh: '奈洛比', country: 'Kenya', countryCode: 'KE', lat: -1.2921, lng: 36.8219, radiusKm: 25 },
  { name: 'Marrakech', nameZh: '馬拉喀什', country: 'Morocco', countryCode: 'MA', lat: 31.6295, lng: -7.9811, radiusKm: 18 },
  { name: 'Casablanca', nameZh: '卡薩布蘭卡', country: 'Morocco', countryCode: 'MA', lat: 33.5731, lng: -7.5898, radiusKm: 22 },

  // Taiwan (home base)
  { name: 'Taipei', nameZh: '台北', country: 'Taiwan', countryCode: 'TW', lat: 25.0330, lng: 121.5654, radiusKm: 20 },
]

export const getCityByName = (name: string): City | undefined =>
  CITIES.find((c) => c.name === name)

export const getCitiesByCountry = (countryCode: string): City[] =>
  CITIES.filter((c) => c.countryCode === countryCode)

export const searchCities = (query: string): City[] => {
  const q = query.toLowerCase()
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameZh.includes(query) ||
      c.country.toLowerCase().includes(q)
  )
}

export const COUNTRY_EMOJIS: Record<string, string> = {
  JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳', HK: '🇭🇰', MO: '🇲🇴',
  TH: '🇹🇭', VN: '🇻🇳', SG: '🇸🇬', MY: '🇲🇾', ID: '🇮🇩',
  PH: '🇵🇭', MM: '🇲🇲', KH: '🇰🇭', LA: '🇱🇦',
  IN: '🇮🇳', LK: '🇱🇰', NP: '🇳🇵',
  AE: '🇦🇪', QA: '🇶🇦', TR: '🇹🇷', IL: '🇮🇱',
  GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', NL: '🇳🇱', BE: '🇧🇪',
  CH: '🇨🇭', AT: '🇦🇹', CZ: '🇨🇿', HU: '🇭🇺', PL: '🇵🇱',
  IT: '🇮🇹', ES: '🇪🇸', PT: '🇵🇹', GR: '🇬🇷',
  DK: '🇩🇰', SE: '🇸🇪', NO: '🇳🇴', FI: '🇫🇮', IS: '🇮🇸',
  IE: '🇮🇪', RU: '🇷🇺',
  US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽', BR: '🇧🇷', AR: '🇦🇷', PE: '🇵🇪',
  AU: '🇦🇺', NZ: '🇳🇿', FJ: '🇫🇯',
  EG: '🇪🇬', ZA: '🇿🇦', KE: '🇰🇪', MA: '🇲🇦',
  TW: '🇹🇼',
}
