import { useLocalSearchParams } from "expo-router";

import { Text, View } from "react-native";
import TranscribeResults from "../../components/TranscribeResults";
import { storage } from "../../components/Storage";

export default function Page() {
  const { id } = useLocalSearchParams();

  const title = decodeURI(id! as string);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "stretch",
        backgroundColor: "#e1e4f3",
        paddingVertical: 5,
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          paddingVertical: 10,
          fontSize: 22,
          alignSelf: "center",
        }}
      >
        {title}
      </Text>

      <TranscribeResults
        current={false}
        results={storage
          .getString(title)!
          .replace(
            /(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm,
            "$1$2|"
          )
          .split("|")}
      />
    </View>
  );
}
