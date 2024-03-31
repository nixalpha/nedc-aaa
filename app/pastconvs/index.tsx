import { Link } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { storage } from "../../components/Storage";
import { useCallback, useState } from "react";
import { SwipeListView } from "react-native-swipe-list-view";

import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import DialogInput from "react-native-dialog-input";

type ChangeInfo = {
  changing: boolean;
  name: string;
};

export default function PastConvs() {
  const [refreshing, setRefreshing] = useState(false);
  const [ids, setIds] = useState(storage.getAllKeys());
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIds(storage.getAllKeys());
    setRefreshing(false);
  }, []);

  const [changeInfo, setChangeInfo] = useState<ChangeInfo>({
    changing: false,
    name: "",
  });

  const renderItem = (data: { item: string; index: number }) => (
    <View
      key={data.index}
      style={{
        backgroundColor: "#88A4D3",
        height: 50,
        padding: 5,
        justifyContent: "center",
        borderBottomColor: "black",
        borderBottomWidth: 1,
      }}
    >
      <Link
        style={{ color: "white", fontWeight: "bold", fontSize: 22 }}
        href={{ pathname: "/pastconvs/[id]", params: { id: data.item } }}
      >
        {data.item}
      </Link>
    </View>
  );

  const renderHiddenItem = (data: { item: string; index: number }) => (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#e1e4f3",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
      }}
    >
      <TouchableOpacity
        style={{
          alignItems: "center",
          bottom: 0,
          justifyContent: "center",
          position: "absolute",
          top: 0,
          width: 75,
          right: 75,
        }}
        onPress={() => setChangeInfo({ changing: true, name: data.item })}
      >
        <MIcon name="file-edit-outline" size={25} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignItems: "center",
          bottom: 0,
          justifyContent: "center",
          position: "absolute",
          top: 0,
          width: 75,
          right: 0,
        }}
        onPress={() =>
          Alert.alert(
            "Delete Conversation",
            "Are you sure you want to delete this conversation?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: () => {
                  storage.delete(data.item);
                  onRefresh();
                },
                style: "destructive",
              },
            ],
            { cancelable: true }
          )
        }
      >
        <MIcon name="trash-can-outline" size={25} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <DialogInput
        isDialogVisible={changeInfo.changing}
        title={"Change Conversation Name"}
        message={"Enter the new conversation name:"}
        hintInput={"Conversation ###"}
        submitInput={(inputText) => {
          const text = storage.getString;
          storage.set(inputText, storage.getString(changeInfo.name)!);
          storage.delete(changeInfo.name);

          onRefresh();

          setChangeInfo({ changing: false, name: "" });
        }}
        closeDialog={() => {
          setChangeInfo({ changing: false, name: "" });
        }}
      ></DialogInput>
      <SwipeListView<string>
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={ids}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150} // Adjust this value based on the width of your hidden buttons
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        disableRightSwipe={true}
      />
    </View>
  );
}
