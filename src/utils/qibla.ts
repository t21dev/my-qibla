// Kaaba coordinates (Mecca, Saudi Arabia)
const KAABA_LAT = 21.4225
const KAABA_LON = 39.8262

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Calculate the Qibla direction (bearing to Kaaba) from a given location
 * @param lat - Latitude of the user's location in degrees
 * @param lon - Longitude of the user's location in degrees
 * @returns Bearing to Qibla in degrees (0-360, where 0 is North)
 */
export function calculateQiblaDirection(lat: number, lon: number): number {
  const lat1 = toRadians(lat)
  const lat2 = toRadians(KAABA_LAT)
  const deltaLon = toRadians(KAABA_LON - lon)

  const x = Math.sin(deltaLon) * Math.cos(lat2)
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon)

  let bearing = toDegrees(Math.atan2(x, y))

  // Normalize to 0-360
  bearing = (bearing + 360) % 360

  return bearing
}

/**
 * Calculate the distance to Kaaba in kilometers
 * Uses the Haversine formula
 */
export function calculateDistanceToKaaba(lat: number, lon: number): number {
  const R = 6371 // Earth's radius in kilometers

  const lat1 = toRadians(lat)
  const lat2 = toRadians(KAABA_LAT)
  const deltaLat = toRadians(KAABA_LAT - lat)
  const deltaLon = toRadians(KAABA_LON - lon)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

