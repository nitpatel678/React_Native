// utils/routeOptimizer.ts
import * as Location from 'expo-location';

export const  getSafeRoute = async (
  currentLocation: { latitude: number; longitude: number },
  destinationText: string
): Promise<{ coords: { latitude: number; longitude: number }[] }> => {
  // Normally you'd use a safe-routing API or Mapbox Directions API here
  // This is a mock version assuming fixed safe points for demonstration

  const destCoords = await Location.geocodeAsync(destinationText);
  if (!destCoords || destCoords.length === 0) return null;

  const destination = {
    latitude: destCoords[0].latitude,
    longitude: destCoords[0].longitude,
  };

  // MOCK safe route (replace this with actual directions API logic)
  const coords = [
    currentLocation,
    {
      latitude: (currentLocation.latitude + destination.latitude) / 2 + 0.001, // safe midpoint
      longitude: (currentLocation.longitude + destination.longitude) / 2 - 0.001,
    },
    destination,
  ];

  return { coords };
};
