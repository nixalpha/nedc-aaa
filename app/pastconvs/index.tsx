import { View, Text, ScrollView } from "react-native";

const testText = ["abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz", "abcdefg", "hijklmnop", "qrswxyz",];

type PCProps = {
  convs: string[];
};

export default function PastConvs( ) {
  return (
    <ScrollView>
      <View style={{ padding: 10 }}>
        {testText.map((item, index) => (
          <View key={index}>
            <Text selectable={true}>{item}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
