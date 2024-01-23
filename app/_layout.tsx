import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/Entypo";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="asr"
        options={{
          tabBarLabel: "ASR",
          title: "Speech Audio to Text",
          tabBarIcon: ({ focused, size }) => (
            <Icon name="mic" size={size} color="#88A4D3" />
          ),
        }}
      />
      <Tabs.Screen
        name="tts"
        options={{
          tabBarLabel: "TTS",
          title: "Text to Speech",
          tabBarIcon: ({ focused, size }) => (
            <MIcon name="speaker" size={size} color="#88A4D3" />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="test" options={{ href: null }} />
      <Tabs.Screen name="onnx" options={{ href: null }} />
    </Tabs>
  );
}
