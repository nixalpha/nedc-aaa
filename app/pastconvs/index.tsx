import { Link } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { storage } from "../../components/Storage";
import { useCallback, useState } from "react";

export default function PastConvs() {
  const [refreshing, setRefreshing] = useState(false);
  const [ids, setIds] = useState(storage.getAllKeys());
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIds(storage.getAllKeys());
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#e1e4f3" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 10, flex: 1, gap: 10 }}>
        {ids.map((item, index) => (
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
