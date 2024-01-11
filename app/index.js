import {
  Button,
  View,
  Pressable,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

import { Audio } from "expo-av";

import MICnedc from "./assets/MICnedc.svg";

export default function Page() {
  const [isMicOn, setIsMicOn] = useState(false);

  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [text, setText] = useState("");

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync( {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        outputFormat: ".mp3"
      }
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    uploadAudioAsync(uri)
      .then((response) => response.text())
      .then((response) => {
        console.log(response);
        setText(text + "\nabcde");
      })
      .catch((err) => console.log(err));
  }

  async function uploadAudioAsync(uri) {
    console.log("Uploading " + uri);
    let apiUrl = "http://127.0.0.1:9000/asr?encode=true&task=transcribe&vad_filter=false&word_timestamps=false&output=txt";
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append("audio_file", {
      uri,
      name: `recording.${fileType}`,
      type: `audio/x-${fileType}`,
    });

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("POSTing " + uri + " to " + apiUrl);
    return fetch(apiUrl, options);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <Link href="/asr">ASR</Link>

      <Link href="/tts">TTS</Link> */}

      <View
        style={{
          flex: 1,
          alignItems: "center",
          padding: 16,
          gap: 20,
          flexDirection: "column",
          borderWidth: 1,
        }}
      >
        <Pressable
          style={{
            borderWidth: 1,
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            verticalAlign: "middle",
          }}
          onPress={recording ? stopRecording : startRecording}
        >
          <MICnedc width={100} height={100} />
        </Pressable>

        <Pressable
          style={{
            borderWidth: 1,
            width: 150,
            height: 30,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={() => setIsMicOn(!isMicOn)}
        >
          <Text>{isMicOn ? "mic on" : "mic off"}</Text>
        </Pressable>

        <View style={{ backgroundColor: "aquamarine", height: "75%", width: "100%" }}>
          <ScrollView>
            <Text>
              {text}
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
