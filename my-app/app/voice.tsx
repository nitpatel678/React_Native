import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as SpeechRecognition from 'expo-speech';

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartListening = () => {
    setIsListening(true);
    // Placeholder: Add speech-to-text logic
    // For now, simulate speech input
    setTimeout(() => {
      const fakeTranscript = 'Where am I?';
      setTranscript(fakeTranscript);
      Speech.speak(`You said: ${fakeTranscript}`);
      setIsListening(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <TouchableOpacity
        className="bg-black p-6 rounded-full mb-6"
        onPress={handleStartListening}
      >
        <MaterialIcons name="keyboard-voice" size={40} color="white" />
      </TouchableOpacity>
      {isListening ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <Text className="text-lg text-center text-gray-700">{transcript || 'Tap to speak'}</Text>
      )}
    </View>
  );
}
