import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Linking, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import EmergencyButton from '@/components/EmergencyButton';
import {
  getCurrentLocation,
  findNearbyHospitals,
  openGoogleMapsDirections,
  openGoogleMapsSearch,
  Hospital,
} from '@/lib/mapsService';

export default function DoctorsScreen() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        const nearbyHospitals = await findNearbyHospitals(
          currentLocation.latitude,
          currentLocation.longitude,
          10000 // 10km radius
        );
        setHospitals(nearbyHospitals);
      } else {
        // If location permission denied, show default hospitals (Bangalore)
        const defaultHospitals = await findNearbyHospitals(12.9716, 77.5946, 10000);
        setHospitals(defaultHospitals);
        Alert.alert(
          'Location Permission',
          'Please enable location services to find hospitals near you. Showing default hospitals.',
        );
      }
    } catch (error) {
      console.error('Error loading hospitals:', error);
      // Show default hospitals on error
      const defaultHospitals = await findNearbyHospitals(12.9716, 77.5946, 10000);
      setHospitals(defaultHospitals);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleDirections = async (hospital: Hospital) => {
    try {
      await openGoogleMapsDirections(hospital.latitude, hospital.longitude, hospital.name);
    } catch (error) {
      Alert.alert('Error', 'Could not open maps. Please check if Google Maps is installed.');
    }
  };

  const handleFindMore = () => {
    openGoogleMapsSearch('hospitals near me');
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="medical" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Nearby Hospitals
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Find hospitals and healthcare facilities near you
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search hospitals..."
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={loadHospitals}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <ThemedText style={styles.refreshButtonText}>Refresh</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {loading ? (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <ThemedText style={styles.loadingText}>Finding nearby hospitals...</ThemedText>
          </Animated.View>
        ) : filteredHospitals.length > 0 ? (
          <View style={styles.hospitalList}>
            {filteredHospitals.map((hospital, index) => (
              <Animated.View
                entering={FadeInDown.delay(200 + index * 100).duration(500)}
                key={hospital.id}
                style={styles.hospitalCard}
              >
                <View style={styles.hospitalInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.hospitalName}>
                    {hospital.name}
                  </ThemedText>
                  <View style={styles.hospitalDetails}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <ThemedText style={styles.hospitalAddress}>{hospital.address}</ThemedText>
                  </View>
                  {hospital.distance !== undefined && (
                    <ThemedText style={styles.hospitalDistance}>
                      <Ionicons name="walk-outline" size={14} color="#6B7280" /> {hospital.distance.toFixed(1)} km away
                    </ThemedText>
                  )}
                  {hospital.phone && (
                    <ThemedText style={styles.hospitalPhone}>
                      <Ionicons name="call-outline" size={14} color="#6B7280" /> {hospital.phone}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.actionsContainer}>
                  {hospital.phone && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall(hospital.phone!)}
                    >
                      <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDirections(hospital)}
                  >
                    <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <Ionicons name="location-outline" size={48} color="#9CA3AF" />
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              {searchQuery ? 'No hospitals found' : 'No hospitals found'}
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search term or refresh your location'
                : 'Try refreshing your location or search for hospitals on Google Maps'}
            </ThemedText>
            {!searchQuery && (
              <TouchableOpacity style={styles.findMoreButton} onPress={handleFindMore}>
                <ThemedText style={styles.findMoreButtonText}>Search on Google Maps</ThemedText>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <TouchableOpacity style={styles.findMoreButton} onPress={handleFindMore}>
            <Ionicons name="search-outline" size={20} color="#FFFFFF" />
            <ThemedText style={styles.findMoreButtonText}>Find More Hospitals on Google Maps</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    opacity: 0.9,
  },
  searchContainer: {
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  refreshButton: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hospitalList: {
    gap: 15,
  },
  hospitalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hospitalInfo: {
    flex: 1,
    gap: 8,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  hospitalDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  hospitalAddress: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  hospitalDistance: {
    fontSize: 12,
    color: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hospitalPhone: {
    fontSize: 12,
    color: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  actionButton: {
    backgroundColor: '#0a7ea4',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    color: '#111827',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  findMoreButton: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  findMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
