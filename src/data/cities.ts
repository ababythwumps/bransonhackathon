export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population: number;
  slug: string;
}

export const majorCities: City[] = [
  {
    name: "San Francisco",
    country: "USA",
    latitude: 37.7749,
    longitude: -122.4194,
    population: 874961,
    slug: "SanFrancisco"
  }
];

/**
 * Calculates the distance between two points using the Haversine formula.
 * @param lat1 Latitude of the first point in degrees
 * @param lon1 Longitude of the first point in degrees
 * @param lat2 Latitude of the second point in degrees
 * @param lon2 Longitude of the second point in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number, 
  lat2: number,
  lon2: number
): number {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  
  const rlat1 = toRadians(lat1);
  const rlon1 = toRadians(lon1);
  const rlat2 = toRadians(lat2);
  const rlon2 = toRadians(lon2);
  
  // Haversine formula
  const dLat = rlat2 - rlat1;
  const dLon = rlon2 - rlon1;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(rlat1) * Math.cos(rlat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Earth's radius in kilometers
  const R = 6371;
  
  // Calculate the distance
  return R * c;
}

/**
 * Finds the nearest city to a given location with a population over the specified threshold.
 * Only considers cities in the USA.
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @param minPopulation Minimum population threshold (default: 50000)
 * @returns The nearest city object
 */
export function findNearestCity(
  latitude: number,
  longitude: number,
  minPopulation: number = 50000
): City {
  // Filter cities with population over the threshold (all are in USA already)
  const eligibleCities = majorCities.filter(city => city.population >= minPopulation);
  
  if (eligibleCities.length === 0) {
    throw new Error(`No cities found with population over ${minPopulation}`);
  }
  
  // Calculate distance to each eligible city
  const citiesWithDistance = eligibleCities.map(city => ({
    ...city,
    distance: calculateDistance(latitude, longitude, city.latitude, city.longitude)
  }));
  
  // Sort by distance
  citiesWithDistance.sort((a, b) => a.distance - b.distance);
  
  // Return the closest city (we know it exists since we filtered above)
  return citiesWithDistance[0] as City;
}