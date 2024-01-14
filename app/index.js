import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 16,
        gap: 20,
        backgroundColor: '#88A4D3'
      }}
    >
      <Text style={{ fontSize: 30, color: 'white' }}>
        Welcome to Audible Accessibility for All!
      </Text>

      <Link href="/asr" asChild>
        <Button title="Audio to Text"></Button>
      </Link>

      <Link href="/tts" asChild>
        <Button title="Text to Speech"></Button>
      </Link>
    </View>
  );
}
