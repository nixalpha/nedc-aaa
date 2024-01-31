import { ScrollView, StyleSheet, View, Text } from "react-native";

type StringListProps = {
  results: string[];
};

export default function TranscribeResults(props: StringListProps) {
  return (
    <ScrollView>
      <View style={{ paddingVertical: 10 }}>
        {props.results.map((item, index) => (
          <View key={index}>
            <Text>{item}</Text>

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
