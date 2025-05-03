// app/sos.tsx
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import * as Audio from 'expo-av';
import { useState } from 'react';

export default function SosScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [location, setLocation] = useState<string>('Fetching location...');

  const emergencyContacts = ['9696612028', '9548311935']; // Replace with real numbers

  const sendSOS = async () => {
    try {
      // 1. Get Location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const locationMsg = `Emergency! I need help. My location: https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`;
      setLocation(locationMsg);

      // 2. Send SMS to contacts
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(emergencyContacts, locationMsg);
      } else {
        Alert.alert('SMS not available on this device');
      }

      // 3. (Optional) Upload or save voice message (not supported natively in Expo)
      Alert.alert('SOS Sent', 'Emergency message and location sent.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send SOS.');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Microphone access is needed.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Voice note saved at:', uri);
      // You can upload `uri` to a server or share it
      setRecording(null);
    }
  };

  return (
    <View className="flex-1 bg-red-50 items-center justify-center px-6 space-y-4">
      <Text className="text-xl font-bold text-red-600">Emergency SOS</Text>
      <Text className="text-gray-700 text-center">{location}</Text>

      <TouchableOpacity
        className="bg-red-600 px-6 py-4 rounded-full"
        onPress={sendSOS}
      >
        <Text className="text-white font-semibold">Send Emergency SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-black px-6 py-3 rounded-full"
        onPress={recording ? stopRecording : startRecording}
      >
        <Text className="text-white">{recording ? 'Stop Recording' : 'Record Voice Note'}</Text>
      </TouchableOpacity>
    </View>
  );
}
