import { useRef } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";

type TRProps = {
  results: string[];
};

export default function TranscribeResults(props: TRProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      <View style={{ paddingVertical: 10 }}>
        {props.results.map((item, index) => (
          <View key={index}>
            <Text selectable={true}>{item}</Text>

            {index < props.results.length - 1 && (
              <View
                style={{
                  height: 1,
                  backgroundColor: "black",
                  marginVertical: 10,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
