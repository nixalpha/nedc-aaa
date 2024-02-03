import { ScrollView, StyleSheet, View, Text } from "react-native";

type TRProps = {
  results: string[];
};

export default function TranscribeResults(props: TRProps) {
  return (
    <ScrollView>
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
