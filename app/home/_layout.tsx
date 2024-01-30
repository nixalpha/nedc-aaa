import { Tabs } from "expo-router";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

const IconView = (props: { focused: boolean; children: React.ReactNode }) => {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 5,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: props.focused ? "#e1e4f3" : "",
        padding: 2,
        margin: 2
      }}
    >
      {props.children}
    </View>
  );
};

export default function _layout() {
    return (
    <Tabs screenOptions={{ headerTitleAlign: "center", headerShown: false }}>
      <Tabs.Screen
        name="asr"
        options={{
          tabBarLabel: "ASR",
          title: "Speech Audio to Text",
          tabBarIcon: ({ focused, size }) => (
            <IconView focused={focused}>
              <Icon name="mic" size={size} color="#88A4D3" />
            </IconView>
          ),
        }}
      />
      <Tabs.Screen
        name="tts"
        options={{
          tabBarLabel: "TTS",
          title: "Text to Speech",
          tabBarIcon: ({ focused, size }) => (
            <IconView focused={focused}>
              <MIcon name="speaker" size={size} color="#88A4D3" />
            </IconView>
          ),
        }}
      />
      <Tabs.Screen name="test" options={{ href: null }} />
    </Tabs>
  );
}