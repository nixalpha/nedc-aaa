import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import * as Speech from 'expo-speech';

export default function Page() {
  const speak = () => {
    const thingToSay = 'The quick brown fox jumps over the lazy dog';
    Speech.speak(thingToSay);
  };

  return (
    <View>
      <Button title="Press to hear some words" onPress={speak} />
    </View>
  );
}