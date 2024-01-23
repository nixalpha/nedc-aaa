import { View, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import { useEffect, useState } from "react";

import { Audio } from "expo-av";
import { Asset } from "expo-asset";

import { InferenceSession, Tensor } from "onnxruntime-react-native";
import MICnedc from "../assets/icons/MICnedc.svg";

import LiveAudioStream, { Options } from 'react-native-live-audio-stream';

let Session: InferenceSession;

const options: Options = {
  sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
  channels: 1,        // 1 or 2, default 1
  bitsPerSample: 16,  // 8 or 16, default 16
  audioSource: 6,     // android only (see below)
  bufferSize: 4096,    // default is 2048
  wavFile: ""
};

// LiveAudioStream.init(options);
// LiveAudioStream.on('data', (data: string) => {
//   console.log(data)
// });
// LiveAudioStream.start();
// LiveAudioStream.stop();

export default function Page() {
  const [isMicOn, setIsMicOn] = useState(false);

  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [text, setText] = useState("");

  // useEffect(() => {
  //   LiveAudioStream.init(options);
  // }, [])

  async function loadModel() {
    const modelPath = require("../assets/whisper_cpu_int8_model.onnx");
    const assets = await Asset.loadAsync(modelPath);
    const modelUri = assets[0].localUri;

    if (modelUri) {
      Session = await InferenceSession.create(modelUri);
      // Session = await InferenceSession.create(modelUri, {executionProviders: ["nnapi"]});
      console.log("onnx model loaded successfully");
    }
  }

  function unsignedByteToSigned(unsignedByte: number) {
    return unsignedByte > 127 ? unsignedByte - 256 : unsignedByte;
  }

  async function runModel(audioBuffer: number[], beams = 1) {
    let floatArray = [];

    for (let i = 0; i < audioBuffer.length; i++) {
      floatArray[i] = unsignedByteToSigned(audioBuffer[i]) / 32768.0;
      floatArray[i] = Math.max(floatArray[i], -1);
      floatArray[i] = Math.min(floatArray[i], 1);
    }

    const min_length = Int32Array.from({ length: 1 }, () => 1);
    const max_length = Int32Array.from({ length: 1 }, () => 448);
    const num_return_sequences = Int32Array.from({ length: 1 }, () => 1);
    const length_penalty = Float32Array.from({ length: 1 }, () => 1);
    const repetition_penalty = Float32Array.from({ length: 1 }, () => 1);

    const feed = {
      audio_pcm: new Tensor(new Float32Array(floatArray), [
        1,
        audioBuffer.length,
      ]),

      max_length: new Tensor(new Int32Array(max_length), [1]),
      min_length: new Tensor(new Int32Array(min_length), [1]),
      num_beams: new Tensor(
        Int32Array.from({ length: 1 }, () => beams),
        [1]
      ),
      num_return_sequences: new Tensor(new Int32Array(num_return_sequences), [
        1,
      ]),
      length_penalty: new Tensor(new Float32Array(length_penalty), [1]),
      repetition_penalty: new Tensor(new Float32Array(repetition_penalty), [
        1,
      ]),
    };

    const fetches = await Session.run(feed);
    console.log(fetches);

    const output = fetches[Session.outputNames[0]];
    console.log(output.data);
  }

  function test() {
    const min_length = Int32Array.from({ length: 5 }, () => 448);
    const length_penalty = Float32Array.from({ length: 1 }, () => 1);

    console.log(new Float32Array(min_length));
    // console.log(typeof length_penalty);
  }

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

      <Button title="load model" onPress={loadModel}></Button>
      <Button title="test" onPress={test}></Button>

      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          backgroundColor: "#e1e4f3",
          borderRadius: 10,
        }}
      >
        <ScrollView>
          <Text>{text}</Text>
        </ScrollView>
      </View>
    </View>
  );
}
