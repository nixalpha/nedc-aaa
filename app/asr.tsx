import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";

import { Audio } from "expo-av";

import MICnedc from "../assets/icons/MICnedc.svg";

import { initWhisper } from "whisper.rn";

export default function ASR() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [stopTranscribe, setStopTranscribe] = useState<{stop: () => void} | null>(null);

  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [text, setText] = useState("");

  return (
    <View
      style={{
        flex: 1,
        gap: 20,
        padding: 16,
        backgroundColor: "#88A4D3",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          borderWidth: 1,
          width: 100,
          height: 100,
          borderRadius: 50,
          alignItems: "center"
        }}
        onPress={async () => {
          if (permissionResponse?.status !== "granted") {
            console.log("Requesting permission..");
            await requestPermission();
          }

          if (stopTranscribe && stopTranscribe?.stop) {
            await stopTranscribe.stop();
            setStopTranscribe(null);
            setIsMicOn(false);
            return;
          }

          const ctx = await initWhisper({
            filePath: require("../assets/ggml-tiny.en.bin"),
          });

          console.log("Start realtime transcribing...");
          setIsMicOn(true);

          const options = {
            language: "en",
            realtimeAudioSec: 120,
            realtimeAudioSliceSec: 10,
            useVad: true,
          };
          const { stop, subscribe } = await ctx.transcribeRealtime(options);
          setStopTranscribe({stop});

          subscribe((evt) => {
            const { isCapturing, data, processTime, recordingTime } = evt;
            // console.log(
            //   `Realtime transcribing: ${isCapturing ? "ON" : "OFF"}\n` +
            //     // The inference text result from audio record:
            //     `Result: ${data.result}\n\n` +
            //     `Process time: ${processTime}ms\n` +
            //     `Recording time: ${recordingTime}ms`
            // );
            console.log(`${data?.result}\n\n`);
            setText(`${data?.result}`);
            if (!isCapturing) {
              console.log("Finished realtime transcribing");
              setStopTranscribe(null);
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
          backgroundColor: "white",
        }}
        onPress={() => setIsMicOn(!isMicOn)}
        disabled={true}
      >
        <Text>{isMicOn ? "mic on" : "mic off"}</Text>
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          backgroundColor: "#e1e4f3",
          borderRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: 10
        }}
      >
        <ScrollView>
          <Text>{text}</Text>
        </ScrollView>
      </View>
    </View>
  );
}
