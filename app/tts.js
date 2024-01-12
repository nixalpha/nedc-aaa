import * as React from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import * as Speech from "expo-speech";

import Soundbox from "./assets/SOUNDBOXnedc.svg";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";

export default function Page() {
  const [text, setText] = useState("");

  const speak = () => {
    const thingToSay = text;
    Speech.speak(thingToSay);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          padding: 16,
          gap: 20,
          flexDirection: "column",
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            verticalAlign: "middle",
          }}
          onPress={speak}
        >
          <Soundbox width={100} height={100} />
        </TouchableOpacity>
        <TextInput
          style={{
            backgroundColor: "aquamarine",
            height: "75%",
            width: "100%",
            borderRadius: 10,
            textAlignVertical: 'top'
          }}
          value={text}
          onChangeText={setText}
        ></TextInput>
      </View>
    </View>
  );
}
