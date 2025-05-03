import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getSafeRoute } from './utils/routeOptimizer'; // We'll add this next
import * as Speech from 'expo-speech';

export default function NavigationScreen() {
  const [region, setRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleStartNavigation = async () => {
    if (!destination) {
      Alert.alert('Missing Input', 'Please enter a destination.');
      return;
    }

    try {
      const safeRoute = await getSafeRoute(currentLocation, destination);
      if (safeRoute) {
        setRouteCoordinates(safeRoute.coords);
        Speech.speak("Navigation started to " + destination, { rate: 0.9 });
      } else {
        Alert.alert('Route Error', 'Unable to find a safe route.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Navigation Error', 'Something went wrong.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      {region && (
        <MapView
          ref={mapRef}
          className="flex-1"
          initialRegion={region}
          showsUserLocation
        >
          {currentLocation && (
            <Marker coordinate={currentLocation} title="You are here" />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#3B82F6"
              strokeWidth={4}
            />
          )}
        </MapView>
      )}

      <View className="absolute top-0 w-full p-4 bg-white z-10">
        <Text className="text-lg font-bold mb-2 text-black">Enter Destination:</Text>
        <TextInput
          placeholder="e.g., AIIMS Hospital"
          className="border border-gray-300 rounded-md p-2 bg-white mb-2"
          value={destination}
          onChangeText={setDestination}
          accessible
          accessibilityLabel="Enter destination"
        />
        <TouchableOpacity
          onPress={handleStartNavigation}
          className="bg-blue-600 rounded-md p-3"
        >
          <Text className="text-white text-center font-medium">Start Safe Navigation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
