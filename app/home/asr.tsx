import { View, Text, ScrollView, TouchableOpacity, Button, ActivityIndicator } from "react-native";
import { useEffect, useState, useRef } from "react";

import { Audio } from "expo-av";

import MICnedc from "../../assets/icons/MICnedc.svg";

import { WhisperContext, initWhisper } from "whisper.rn";
import TranscribeResults from "../../components/TranscribeResults";

import { storage } from "../../components/Storage";

export default function ASR() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [stopTranscribe, setStopTranscribe] = useState<{
    stop: () => void;
  } | null>(null);

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [context, setContext] = useState<WhisperContext>();

  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const ctx = await initWhisper({
        filePath: require("../../assets/ggml-tiny.en.bin"),
      });  

      setContext(ctx);
    }

    init().then(() => {console.log("finished init")});
  }, [])

  async function transcribe() {
    if (permissionResponse?.status !== "granted") {
      console.log("Requesting permission..");
      await requestPermission();
    }

    if (stopTranscribe && stopTranscribe?.stop) {
      console.log("Stopping realtime transcribing");
      setSaving(true);
      stopTranscribe.stop();
      // setStopTranscribe(null);
      // setIsMicOn(false);
      storage.set("Conversation " + (storage.getAllKeys().length + 1), text);
      // console.log(storage.getAllKeys());

      return;
    }

    console.log("Start realtime transcribing...");
    setIsMicOn(true);

    // const options = {
    //   language: "en",
    //   realtimeAudioSec: 10,
    //   realtimeAudioSliceSec: 10,
    //   useVad: true,
    // };
    const options = { 
      language: 'auto',
      realtimeAudioSec: 10,
      realtimeAudioSliceSec: 5,
   };
    const { stop, subscribe } = await context!.transcribeRealtime(options);
    setStopTranscribe({ stop });

    subscribe((evt) => {
      const { isCapturing, data, processTime, recordingTime } = evt;
      setText(`${data?.result}`);

      if (!isCapturing) {
        setStopTranscribe(null);
        console.log("Finished realtime transcribing");
        setIsMicOn(false);
      }
    });
  }

  if (context) {
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
            alignItems: "center",
          }}
          onPress={() => {
            transcribe();
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
  
        <Button title="Clear data" onPress={() => storage.clearAll()}></Button>
  
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            backgroundColor: "#e1e4f3",
            borderRadius: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <TranscribeResults
            results={text
            .replace(
              /(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm,
              "$1$2|"
            )
            .split("|")}
          />
        </View>
      </View>
    );
  }
  else {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator color="88A4D3"/>
      </View>
    );
  }
}
