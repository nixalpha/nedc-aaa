import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.pinkView} />
      <View style={styles.pinkView} />
      <View style={styles.blueView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // This is to ensure the view starts below the status bar on iOS
    gap: 15,
  },
  pinkView: {
    height: 50, // dp is the default unit in React Native
    backgroundColor: 'pink',
  },
  blueView: {
    flex: 1, // This will make the blue view take up all remaining space
    backgroundColor: 'blue',
  },
});

export default App;
