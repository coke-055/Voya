export interface Airport {
  iata: string
  name: string
  city: string       // English city name — matches City.name in cities.ts where possible
  cityZh: string
  country: string
  countryCode: string
}

// Major airports commonly used by Taiwanese travelers
export const AIRPORTS: Airport[] = [
  // Taiwan
  { iata: 'TPE', name: 'Taoyuan International', city: 'Taipei', cityZh: '台北', country: 'Taiwan', countryCode: 'TW' },
  { iata: 'TSA', name: 'Songshan Airport', city: 'Taipei', cityZh: '台北', country: 'Taiwan', countryCode: 'TW' },
  { iata: 'KHH', name: 'Kaohsiung International', city: 'Taipei', cityZh: '高雄', country: 'Taiwan', countryCode: 'TW' },
  { iata: 'RMQ', name: 'Taichung Airport', city: 'Taipei', cityZh: '台中', country: 'Taiwan', countryCode: 'TW' },

  // Japan
  { iata: 'NRT', name: 'Narita International', city: 'Tokyo', cityZh: '東京', country: 'Japan', countryCode: 'JP' },
  { iata: 'HND', name: 'Haneda Airport', city: 'Tokyo', cityZh: '東京', country: 'Japan', countryCode: 'JP' },
  { iata: 'KIX', name: 'Kansai International', city: 'Osaka', cityZh: '大阪', country: 'Japan', countryCode: 'JP' },
  { iata: 'ITM', name: 'Itami Airport', city: 'Osaka', cityZh: '大阪', country: 'Japan', countryCode: 'JP' },
  { iata: 'CTS', name: 'New Chitose Airport', city: 'Sapporo', cityZh: '札幌', country: 'Japan', countryCode: 'JP' },
  { iata: 'FUK', name: 'Fukuoka Airport', city: 'Fukuoka', cityZh: '福岡', country: 'Japan', countryCode: 'JP' },
  { iata: 'OKA', name: 'Naha Airport', city: 'Naha', cityZh: '那霸', country: 'Japan', countryCode: 'JP' },
  { iata: 'NGO', name: 'Chubu Centrair', city: 'Nagoya', cityZh: '名古屋', country: 'Japan', countryCode: 'JP' },
  { iata: 'SDJ', name: 'Sendai Airport', city: 'Tokyo', cityZh: '仙台', country: 'Japan', countryCode: 'JP' },
  { iata: 'HIJ', name: 'Hiroshima Airport', city: 'Osaka', cityZh: '廣島', country: 'Japan', countryCode: 'JP' },
  { iata: 'KMQ', name: 'Komatsu Airport', city: 'Nagoya', cityZh: '金澤', country: 'Japan', countryCode: 'JP' },

  // South Korea
  { iata: 'ICN', name: 'Incheon International', city: 'Seoul', cityZh: '首爾', country: 'South Korea', countryCode: 'KR' },
  { iata: 'GMP', name: 'Gimpo International', city: 'Seoul', cityZh: '首爾', country: 'South Korea', countryCode: 'KR' },
  { iata: 'PUS', name: 'Gimhae International', city: 'Busan', cityZh: '釜山', country: 'South Korea', countryCode: 'KR' },
  { iata: 'CJU', name: 'Jeju International', city: 'Jeju', cityZh: '濟州', country: 'South Korea', countryCode: 'KR' },

  // China
  { iata: 'PEK', name: 'Beijing Capital', city: 'Beijing', cityZh: '北京', country: 'China', countryCode: 'CN' },
  { iata: 'PKX', name: 'Beijing Daxing', city: 'Beijing', cityZh: '北京', country: 'China', countryCode: 'CN' },
  { iata: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', cityZh: '上海', country: 'China', countryCode: 'CN' },
  { iata: 'SHA', name: 'Shanghai Hongqiao', city: 'Shanghai', cityZh: '上海', country: 'China', countryCode: 'CN' },
  { iata: 'CAN', name: 'Guangzhou Baiyun', city: 'Guangzhou', cityZh: '廣州', country: 'China', countryCode: 'CN' },
  { iata: 'SZX', name: 'Shenzhen Bao\'an', city: 'Shenzhen', cityZh: '深圳', country: 'China', countryCode: 'CN' },
  { iata: 'CTU', name: 'Chengdu Tianfu', city: 'Chengdu', cityZh: '成都', country: 'China', countryCode: 'CN' },
  { iata: 'XIY', name: 'Xi\'an Xianyang', city: 'Xi\'an', cityZh: '西安', country: 'China', countryCode: 'CN' },

  // Hong Kong / Macau
  { iata: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', cityZh: '香港', country: 'Hong Kong', countryCode: 'HK' },
  { iata: 'MFM', name: 'Macau International', city: 'Macau', cityZh: '澳門', country: 'Macau', countryCode: 'MO' },

  // Southeast Asia — Thailand
  { iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', cityZh: '曼谷', country: 'Thailand', countryCode: 'TH' },
  { iata: 'DMK', name: 'Don Mueang', city: 'Bangkok', cityZh: '曼谷', country: 'Thailand', countryCode: 'TH' },
  { iata: 'CNX', name: 'Chiang Mai International', city: 'Chiang Mai', cityZh: '清邁', country: 'Thailand', countryCode: 'TH' },
  { iata: 'HKT', name: 'Phuket International', city: 'Phuket', cityZh: '普吉', country: 'Thailand', countryCode: 'TH' },
  { iata: 'UTP', name: 'U-Tapao Pattaya', city: 'Pattaya', cityZh: '芭達雅', country: 'Thailand', countryCode: 'TH' },

  // Vietnam
  { iata: 'HAN', name: 'Noi Bai International', city: 'Hanoi', cityZh: '河內', country: 'Vietnam', countryCode: 'VN' },
  { iata: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh City', cityZh: '胡志明市', country: 'Vietnam', countryCode: 'VN' },
  { iata: 'DAD', name: 'Da Nang International', city: 'Da Nang', cityZh: '岘港', country: 'Vietnam', countryCode: 'VN' },

  // Singapore / Malaysia / Indonesia
  { iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', cityZh: '新加坡', country: 'Singapore', countryCode: 'SG' },
  { iata: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', cityZh: '吉隆坡', country: 'Malaysia', countryCode: 'MY' },
  { iata: 'PEN', name: 'Penang International', city: 'Penang', cityZh: '檳城', country: 'Malaysia', countryCode: 'MY' },
  { iata: 'DPS', name: 'Ngurah Rai (Bali)', city: 'Bali', cityZh: '峇里島', country: 'Indonesia', countryCode: 'ID' },
  { iata: 'CGK', name: 'Soekarno–Hatta', city: 'Jakarta', cityZh: '雅加達', country: 'Indonesia', countryCode: 'ID' },

  // Philippines
  { iata: 'MNL', name: 'Ninoy Aquino', city: 'Manila', cityZh: '馬尼拉', country: 'Philippines', countryCode: 'PH' },
  { iata: 'CEB', name: 'Mactan-Cebu International', city: 'Cebu', cityZh: '宿霧', country: 'Philippines', countryCode: 'PH' },

  // Cambodia / Myanmar / Laos
  { iata: 'PNH', name: 'Phnom Penh International', city: 'Phnom Penh', cityZh: '金邊', country: 'Cambodia', countryCode: 'KH' },
  { iata: 'REP', name: 'Siem Reap International', city: 'Siem Reap', cityZh: '暹粒', country: 'Cambodia', countryCode: 'KH' },
  { iata: 'RGN', name: 'Yangon International', city: 'Yangon', cityZh: '仰光', country: 'Myanmar', countryCode: 'MM' },

  // Middle East
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', cityZh: '杜拜', country: 'UAE', countryCode: 'AE' },
  { iata: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', cityZh: '阿布達比', country: 'UAE', countryCode: 'AE' },
  { iata: 'DOH', name: 'Hamad International', city: 'Doha', cityZh: '多哈', country: 'Qatar', countryCode: 'QA' },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', cityZh: '伊斯坦堡', country: 'Turkey', countryCode: 'TR' },

  // Europe
  { iata: 'LHR', name: 'London Heathrow', city: 'London', cityZh: '倫敦', country: 'United Kingdom', countryCode: 'GB' },
  { iata: 'LGW', name: 'London Gatwick', city: 'London', cityZh: '倫敦', country: 'United Kingdom', countryCode: 'GB' },
  { iata: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', cityZh: '愛丁堡', country: 'United Kingdom', countryCode: 'GB' },
  { iata: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', cityZh: '巴黎', country: 'France', countryCode: 'FR' },
  { iata: 'ORY', name: 'Paris Orly', city: 'Paris', cityZh: '巴黎', country: 'France', countryCode: 'FR' },
  { iata: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', cityZh: '尼斯', country: 'France', countryCode: 'FR' },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', cityZh: '法蘭克福', country: 'Germany', countryCode: 'DE' },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', cityZh: '慕尼黑', country: 'Germany', countryCode: 'DE' },
  { iata: 'TXL', name: 'Berlin Tegel', city: 'Berlin', cityZh: '柏林', country: 'Germany', countryCode: 'DE' },
  { iata: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', cityZh: '柏林', country: 'Germany', countryCode: 'DE' },
  { iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', cityZh: '阿姆斯特丹', country: 'Netherlands', countryCode: 'NL' },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', cityZh: '蘇黎世', country: 'Switzerland', countryCode: 'CH' },
  { iata: 'VIE', name: 'Vienna International', city: 'Vienna', cityZh: '維也納', country: 'Austria', countryCode: 'AT' },
  { iata: 'PRG', name: 'Václav Havel Airport', city: 'Prague', cityZh: '布拉格', country: 'Czech Republic', countryCode: 'CZ' },
  { iata: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', cityZh: '布達佩斯', country: 'Hungary', countryCode: 'HU' },
  { iata: 'FCO', name: 'Rome Fiumicino', city: 'Rome', cityZh: '羅馬', country: 'Italy', countryCode: 'IT' },
  { iata: 'MXP', name: 'Milan Malpensa', city: 'Milan', cityZh: '米蘭', country: 'Italy', countryCode: 'IT' },
  { iata: 'VCE', name: 'Venice Marco Polo', city: 'Venice', cityZh: '威尼斯', country: 'Italy', countryCode: 'IT' },
  { iata: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', cityZh: '巴塞隆納', country: 'Spain', countryCode: 'ES' },
  { iata: 'MAD', name: 'Madrid Barajas', city: 'Madrid', cityZh: '馬德里', country: 'Spain', countryCode: 'ES' },
  { iata: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', cityZh: '里斯本', country: 'Portugal', countryCode: 'PT' },
  { iata: 'ATH', name: 'Athens Eleftherios Venizelos', city: 'Athens', cityZh: '雅典', country: 'Greece', countryCode: 'GR' },
  { iata: 'JTR', name: 'Santorini Airport', city: 'Santorini', cityZh: '聖托里尼', country: 'Greece', countryCode: 'GR' },
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', cityZh: '哥本哈根', country: 'Denmark', countryCode: 'DK' },
  { iata: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', cityZh: '斯德哥爾摩', country: 'Sweden', countryCode: 'SE' },
  { iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', cityZh: '奧斯陸', country: 'Norway', countryCode: 'NO' },
  { iata: 'HEL', name: 'Helsinki Vantaa', city: 'Helsinki', cityZh: '赫爾辛基', country: 'Finland', countryCode: 'FI' },
  { iata: 'KEF', name: 'Keflavík International', city: 'Reykjavik', cityZh: '雷克雅維克', country: 'Iceland', countryCode: 'IS' },
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', cityZh: '都柏林', country: 'Ireland', countryCode: 'IE' },
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', cityZh: '布魯塞爾', country: 'Belgium', countryCode: 'BE' },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', cityZh: '日內瓦', country: 'Switzerland', countryCode: 'CH' },
  { iata: 'SVO', name: 'Sheremetyevo', city: 'Moscow', cityZh: '莫斯科', country: 'Russia', countryCode: 'RU' },

  // North America
  { iata: 'JFK', name: 'John F. Kennedy', city: 'New York', cityZh: '紐約', country: 'United States', countryCode: 'US' },
  { iata: 'EWR', name: 'Newark Liberty', city: 'New York', cityZh: '紐約', country: 'United States', countryCode: 'US' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', cityZh: '洛杉磯', country: 'United States', countryCode: 'US' },
  { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco', cityZh: '舊金山', country: 'United States', countryCode: 'US' },
  { iata: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', cityZh: '拉斯維加斯', country: 'United States', countryCode: 'US' },
  { iata: 'ORD', name: 'Chicago O\'Hare', city: 'Chicago', cityZh: '芝加哥', country: 'United States', countryCode: 'US' },
  { iata: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle', cityZh: '西雅圖', country: 'United States', countryCode: 'US' },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', cityZh: '邁阿密', country: 'United States', countryCode: 'US' },
  { iata: 'BOS', name: 'Logan International', city: 'Boston', cityZh: '波士頓', country: 'United States', countryCode: 'US' },
  { iata: 'IAD', name: 'Washington Dulles', city: 'Washington D.C.', cityZh: '華盛頓', country: 'United States', countryCode: 'US' },
  { iata: 'HNL', name: 'Honolulu International', city: 'Honolulu', cityZh: '火奴魯魯', country: 'United States', countryCode: 'US' },
  { iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', cityZh: '多倫多', country: 'Canada', countryCode: 'CA' },
  { iata: 'YVR', name: 'Vancouver International', city: 'Vancouver', cityZh: '溫哥華', country: 'Canada', countryCode: 'CA' },
  { iata: 'YUL', name: 'Montréal-Trudeau', city: 'Montreal', cityZh: '蒙特婁', country: 'Canada', countryCode: 'CA' },
  { iata: 'MEX', name: 'Mexico City International', city: 'Mexico City', cityZh: '墨西哥城', country: 'Mexico', countryCode: 'MX' },
  { iata: 'CUN', name: 'Cancún International', city: 'Cancun', cityZh: '坎昆', country: 'Mexico', countryCode: 'MX' },

  // South America
  { iata: 'GRU', name: 'São Paulo Guarulhos', city: 'Sao Paulo', cityZh: '聖保羅', country: 'Brazil', countryCode: 'BR' },
  { iata: 'GIG', name: 'Rio de Janeiro Galeão', city: 'Rio de Janeiro', cityZh: '里約', country: 'Brazil', countryCode: 'BR' },
  { iata: 'EZE', name: 'Buenos Aires Ezeiza', city: 'Buenos Aires', cityZh: '布宜諾斯艾利斯', country: 'Argentina', countryCode: 'AR' },
  { iata: 'LIM', name: 'Jorge Chávez International', city: 'Lima', cityZh: '利馬', country: 'Peru', countryCode: 'PE' },

  // Oceania
  { iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', cityZh: '雪梨', country: 'Australia', countryCode: 'AU' },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', cityZh: '墨爾本', country: 'Australia', countryCode: 'AU' },
  { iata: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', cityZh: '布里斯本', country: 'Australia', countryCode: 'AU' },
  { iata: 'OOL', name: 'Gold Coast Airport', city: 'Gold Coast', cityZh: '黃金海岸', country: 'Australia', countryCode: 'AU' },
  { iata: 'CNS', name: 'Cairns Airport', city: 'Cairns', cityZh: '凱恩斯', country: 'Australia', countryCode: 'AU' },
  { iata: 'AKL', name: 'Auckland Airport', city: 'Auckland', cityZh: '奧克蘭', country: 'New Zealand', countryCode: 'NZ' },
  { iata: 'ZQN', name: 'Queenstown Airport', city: 'Queenstown', cityZh: '皇后鎮', country: 'New Zealand', countryCode: 'NZ' },
  { iata: 'NAN', name: 'Nadi International', city: 'Nadi', cityZh: '南迪', country: 'Fiji', countryCode: 'FJ' },

  // Africa
  { iata: 'CAI', name: 'Cairo International', city: 'Cairo', cityZh: '開羅', country: 'Egypt', countryCode: 'EG' },
  { iata: 'CPT', name: 'Cape Town International', city: 'Cape Town', cityZh: '開普敦', country: 'South Africa', countryCode: 'ZA' },
  { iata: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', cityZh: '約翰尼斯堡', country: 'South Africa', countryCode: 'ZA' },
  { iata: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', cityZh: '奈洛比', country: 'Kenya', countryCode: 'KE' },
  { iata: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', cityZh: '馬拉喀什', country: 'Morocco', countryCode: 'MA' },

  // India / South Asia
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', cityZh: '孟買', country: 'India', countryCode: 'IN' },
  { iata: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', cityZh: '德里', country: 'India', countryCode: 'IN' },
  { iata: 'BLR', name: 'Kempegowda International', city: 'Bangalore', cityZh: '班加羅爾', country: 'India', countryCode: 'IN' },
  { iata: 'GOI', name: 'Goa International', city: 'Goa', cityZh: '果阿', country: 'India', countryCode: 'IN' },
  { iata: 'CMB', name: 'Bandaranaike International', city: 'Colombo', cityZh: '可倫坡', country: 'Sri Lanka', countryCode: 'LK' },
  { iata: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', cityZh: '加德滿都', country: 'Nepal', countryCode: 'NP' },
]

export const AIRPORT_MAP = Object.fromEntries(AIRPORTS.map((a) => [a.iata, a]))

export function getAirportByIATA(iata: string): Airport | undefined {
  return AIRPORT_MAP[iata.toUpperCase()]
}
