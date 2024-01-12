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
      }}
    >
      <Text style={{ fontSize: 30 }}>
        Welcome to Audible Accessibility for All!
      </Text>

      <Link href="/asr" asChild>
        <Button title="asr"></Button>
      </Link>

      <Link href="/tts" asChild>
        <Button title="tts"></Button>
      </Link>
    </View>
  );
}
