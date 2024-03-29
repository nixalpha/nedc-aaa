import * as React from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";

import Soundbox from "../../assets/icons/SOUNDBOXnedc.svg";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";

export default function TTS() {
  const [text, setText] = useState("");

  const speak = () => {
    const thingToSay = text;
    Speech.speak(thingToSay);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 16,
        gap: 20,
        backgroundColor: "#88A4D3",
      }}
    >
      <TouchableOpacity
        style={{
          borderWidth: 1,
          width: 100,
          height: 100,
          borderRadius: 50,
          alignItems: "center",
        }}
        onPress={speak}
      >
        <Soundbox width={100} height={100} />
      </TouchableOpacity>
      <TextInput
        style={{
          backgroundColor: "#e1e4f3",
          flex: 1,
          alignSelf: "stretch",
          borderRadius: 10,
          textAlignVertical: "top",
          paddingVertical: 5,
          paddingHorizontal: 10
        }}
        value={text}
        onChangeText={setText}
        placeholder="Start typing text to say"
      ></TextInput>
    </View>
  );
}
