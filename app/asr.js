import {
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useState } from "react";

import { Audio } from "expo-av";

import MICnedc from "./assets/MICnedc.svg";

import { initWhisper } from "whisper.rn";

export default function Page() {
  const [isMicOn, setIsMicOn] = useState(false);

  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1, gap: 20, padding: 16, backgroundColor: '#88A4D3', alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            verticalAlign: "middle",
          }}
          onPress={async () => {
            if (permissionResponse.status !== 'granted') {
              console.log('Requesting permission..');
              await requestPermission();
            }

            const ctx = await initWhisper({
              filePath: require("../assets/ggml-tiny.en.bin"),
            });

            console.log("Start realtime transcribing...");
            setIsMicOn(true);

            const options = { 
              language: 'en',
              realtimeAudioSec: 120,
              realtimeAudioSliceSec: 10,
           };
            const { stop, subscribe } = await ctx.transcribeRealtime(options);

            subscribe((evt) => {
              const { isCapturing, data, processTime, recordingTime } = evt;
              // console.log(
              //   `Realtime transcribing: ${isCapturing ? "ON" : "OFF"}\n` +
              //     // The inference text result from audio record:
              //     `Result: ${data.result}\n\n` +
              //     `Process time: ${processTime}ms\n` +
              //     `Recording time: ${recordingTime}ms`
              // );
              console.log(`${data.result}\n\n`);
              setText(data.result);
              if (!isCapturing) {
                console.log("Finished realtime transcribing");
                setIsMicOn(false);
              }
            });
          }}
        >
          <MICnedc width={100} height={100} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 150,
            height: 30,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: "white"
          }}
          onPress={() => setIsMicOn(!isMicOn)}
          disabled={true}
        >
          <Text>{isMicOn ? "mic on" : "mic off"}</Text>
        </TouchableOpacity>

        <View
          style={{
            alignSelf: 'stretch',
            flex: 1,
            backgroundColor: "#e1e4f3",
            borderRadius: 10
          }}
        >
          <ScrollView>
            <Text>{text}</Text>
          </ScrollView>
        </View>
    </View>
  );
}
