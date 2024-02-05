import { Link } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { storage } from "../../components/Storage";

export default function PastConvs() {
  return (
    <ScrollView style={{ backgroundColor: "#e1e4f3" }}>
      <View style={{ padding: 10, flex: 1, gap: 10 }}>
        {storage.getAllKeys().map((item, index) => (
          
          <View
            key={index}
            style={{
              backgroundColor: "#88A4D3",
              borderRadius: 5,
              height: 50,
              padding: 5,
              justifyContent: "center",
            }}
          >
            <Link
              style={{ color: "white", fontWeight: "bold", fontSize: 22 }}
              href={{ pathname: "/pastconvs/[id]", params: { id: item } }}
            >
              {item}
            </Link>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
