import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

const quotes = [
  "You don’t need sight to have vision. – Helen Keller",
  "Technology empowers accessibility.",
  "Independence is a journey, not a destination.",
  "AI is a voice for those who can’t see the world.",
  "Inclusivity starts with empathy."
];

export default function HomeScreen() {
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleVoiceCommand = async () => {
    router.push('/voice');
  };

  return (
    <View className="flex-1 bg-white px-6 py-10 justify-between">
      
      {/* Centered Title */}
      <View className="items-center mt-20">
        <Text className="text-4xl font-extrabold text-black mb-2">SAFE STEP</Text>
        <Text className="text-center text-base text-gray-500 px-4">
          Empowering the visually impaired through smart navigation.
        </Text>
      </View>

      {/* Voice Command Button */}
      <TouchableOpacity
        className="bg-black rounded-3xl p-6 items-center justify-center self-center mt-10 shadow-lg"
        onPress={handleVoiceCommand}
        accessibilityLabel="Start Voice Command"
        accessible
      >
        <MaterialIcons name="keyboard-voice" size={40} color="white" />
        <Text className="text-white text-lg mt-2">Tap or Say "Hey SafeStep"</Text>
      </TouchableOpacity>

      {/* Quote/Facts Display */}
      <View className="mt-10 items-center px-4">
        <Text className="text-center italic text-gray-700 text-base">
          {quotes[quoteIndex]}
        </Text>
      </View>

      {/* Bottom Navigation Bar */}
      <View className="flex-row justify-between items-center bg-gray-100 p-4 rounded-2xl shadow-md mt-10">
        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.push('/navigation')}
        >
          <Entypo name="location" size={24} color="#2563eb" />
          <Text className="text-blue-600 mt-1 text-sm">Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.push('/detection')}
        >
          <FontAwesome5 name="eye" size={24} color="#16a34a" />
          <Text className="text-green-600 mt-1 text-sm">Detect</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center"
          onPress={() => router.push('/sos')}
        >
          <MaterialIcons name="emergency" size={26} color="#7c3aed" />
          <Text className="text-purple-600 mt-1 text-sm">SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
