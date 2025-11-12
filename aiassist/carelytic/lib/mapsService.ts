// Google Maps service for finding nearby hospitals
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  latitude: number;
  longitude: number;
  distance?: number; // in kilometers
}

// Request location permissions
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
}

// Get current location
export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Get location error:', error);
    return null;
  }
}

// Find nearby hospitals using Google Places API
// Note: You'll need a Google Places API key
export async function findNearbyHospitals(
  latitude: number,
  longitude: number,
  radius: number = 5000 // 5km default
): Promise<Hospital[]> {
  try {
    // In production, use Google Places API
    // For now, return mock data with real coordinates
    const mockHospitals: Hospital[] = [
      {
        id: '1',
        name: 'Apollo Hospitals',
        address: '154/11, Bannerghatta Road, Bangalore',
        phone: '+91-80-26304050',
        latitude: 12.9352,
        longitude: 77.6245,
      },
      {
        id: '2',
        name: 'Manipal Hospital',
        address: '98, Rustum Bagh, Old Airport Road, Bangalore',
        phone: '+91-80-25024444',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        id: '3',
        name: 'Fortis Hospital',
        address: '154/9, Bannerghatta Road, Bangalore',
        phone: '+91-80-66214444',
        latitude: 12.9352,
        longitude: 77.6245,
      },
      {
        id: '4',
        name: 'Narayana Health',
        address: '258/A, Bommasandra Industrial Area, Bangalore',
        phone: '+91-80-27835000',
        latitude: 12.8051,
        longitude: 77.7010,
      },
    ];

    // Calculate distances
    const hospitalsWithDistance = mockHospitals.map((hospital) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        hospital.latitude,
        hospital.longitude
      );
      return { ...hospital, distance };
    });

    // Sort by distance
    hospitalsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    // Filter by radius
    return hospitalsWithDistance.filter((h) => (h.distance || 0) <= radius / 1000);
  } catch (error) {
    console.error('Find hospitals error:', error);
    return [];
  }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Open Google Maps with directions
export async function openGoogleMapsDirections(
  destinationLat: number,
  destinationLon: number,
  destinationName?: string
): Promise<void> {
  try {
    const location = await getCurrentLocation();
    
    if (!location) {
      // If we can't get current location, just open destination
      const url = Platform.select({
        ios: `maps://maps.apple.com/?daddr=${destinationLat},${destinationLon}&directionsmode=driving`,
        android: `google.navigation:q=${destinationLat},${destinationLon}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLon}`,
      });

      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          // Fallback to web
          await Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLon}`
          );
        }
      }
      return;
    }

    // Open with directions from current location
    const url = Platform.select({
      ios: `maps://maps.apple.com/?saddr=${location.latitude},${location.longitude}&daddr=${destinationLat},${destinationLon}&directionsmode=driving`,
      android: `google.navigation:q=${destinationLat},${destinationLon}`,
      default: `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destinationLat},${destinationLon}`,
    });

    if (url) {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to web
        await Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destinationLat},${destinationLon}`
        );
      }
    }
  } catch (error) {
    console.error('Open maps error:', error);
    // Fallback to web
    await Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLon}`
    );
  }
}

// Open Google Maps with hospital search
export async function openGoogleMapsSearch(query: string = 'hospitals near me'): Promise<void> {
  try {
    const url = Platform.select({
      ios: `maps://maps.apple.com/?q=${encodeURIComponent(query)}`,
      android: `geo:0,0?q=${encodeURIComponent(query)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    });

    if (url) {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to web
        await Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
        );
      }
    }
  } catch (error) {
    console.error('Open maps search error:', error);
    // Fallback to web
    await Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    );
  }
}

