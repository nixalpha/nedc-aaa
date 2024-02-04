import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState, useRef } from "react";

import { Audio } from "expo-av";

import MICnedc from "../../assets/icons/MICnedc.svg";

import { WhisperContext, initWhisper } from "whisper.rn";
import TranscribeResults from "../../components/TranscribeResults";

import { storage } from "../../components/Storage";

export const useLazyEffect:typeof useEffect = (cb, dep) => {
  const initializeRef = useRef<boolean>(false)

  useEffect((...args) => {
    if (initializeRef.current) {
      cb(...args)
    } else {
      initializeRef.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dep)
}

export default function ASR() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [stopTranscribe, setStopTranscribe] = useState<{
    stop: () => void;
  } | null>(null);

  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [text, setText] = useState(storage.getString("text"));

  const [contexts, setContexts] = useState<WhisperContext[]>();
  const [ctIndex, setCtIndex] = useState(0);

  const [cont, setCont] = useState(true);

  useEffect(() => {
    const init = async () => {
      const ctx1 = await initWhisper({
        filePath: require("../../assets/ggml-tiny.en.bin"),
      });

      console.log("finished init 1");

      const ctx2 = await initWhisper({
        filePath: require("../../assets/ggml-tiny.en.bin"),
      });

      console.log("finished init 2");

      setContexts([ctx1, ctx2]);
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
      stopTranscribe.stop();
      setStopTranscribe(null);
      console.log("stop to null");
      setIsMicOn(false);

      setCont(false);

      storage.set("text", text!);

      return;
    }

    console.log("CTindex: " + ctIndex);
    const ctx = contexts![ctIndex];

    console.log("Start realtime transcribing...");
    setIsMicOn(true);

    // const options = {
    //   language: "en",
    //   realtimeAudioSec: 10,
    //   realtimeAudioSliceSec: 10,
    //   useVad: true,
    // };
    const options = { 
      language: 'en',
      realtimeAudioSec: 10,
      realtimeAudioSliceSec: 10,
   };
    const { stop, subscribe } = await ctx.transcribeRealtime(options);
    setStopTranscribe({ stop });

    subscribe((evt) => {
      const { isCapturing, data, processTime, recordingTime } = evt;
      setText(`${data?.result}`);
      if (!isCapturing) {
        console.log("Finished realtime transcribing");
        setStopTranscribe(null);
        setIsMicOn(false);

        const newCtx = initWhisper({
          filePath: require("../../assets/ggml-tiny.en.bin"),
        });

        newCtx.then((result: WhisperContext) => {
          if (ctIndex == 0) {
            setContexts([result, contexts![1]]);
          }
          else {
            setContexts([contexts![0], result]);
          }
        });

        if (ctIndex == 0) {
          setCtIndex(1);
        }
        else {
          setCtIndex(0);
        }
      }
    });
  }

  useLazyEffect(() => {
    if (cont) {
      transcribe();
    }
  }, [ctIndex])

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
          if (stopTranscribe) {
            setCont(false);
            transcribe();
          }
          else {
            setCont(true);
            transcribe();
          }
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
          paddingHorizontal: 10,
        }}
      >
        <TranscribeResults
          results={(text === undefined) ? [''] : text!
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
