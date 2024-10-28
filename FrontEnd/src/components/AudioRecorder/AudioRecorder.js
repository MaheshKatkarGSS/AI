import axios from "axios";
import React, { useRef, useState } from "react";
import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import audiofile from "../../resource/recordedfile.wav";

const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const totalOutput = useRef([]);
  function getSupportedMimeTypes(media, types, codecs) {
    const isSupported = MediaRecorder.isTypeSupported;
    const supported = [];
    types.forEach((type) => {
      const mimeType = `${media}/${type}`;
      codecs.forEach((codec) =>
        [
          `${mimeType};codecs=${codec}`,
          `${mimeType};codecs=${codec.toUpperCase()}`,
          // /!\ false positive /!\
          // `${mimeType};codecs:${codec}`,
          // `${mimeType};codecs:${codec.toUpperCase()}`
        ].forEach((variation) => {
          if (isSupported(variation)) supported.push(variation);
        })
      );
      if (isSupported(mimeType)) supported.push(mimeType);
    });
    return supported;
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = async () => {
        const audioTypes = ["webm", "ogg", "mp3", "x-matroska"];
        const codecs = [
          "should-not-be-supported",
          "vp9",
          "vp9.0",
          "vp8",
          "vp8.0",
          "avc1",
          "av1",
          "h265",
          "h.265",
          "h264",
          "h.264",
          "opus",
          "pcm",
          "aac",
          "mpeg",
          "mp4a",
        ];
        const supportedAudios = getSupportedMimeTypes(
          "audio",
          audioTypes,
          codecs
        );
        console.log(supportedAudios);
        const reader = new FileReader();
        const recordedBlob = new Blob(chunks.current, {
          type: supportedAudios[0],
        });
        const url = URL.createObjectURL(recordedBlob);
        const formData = new FormData();
        formData.append("blob_file", recordedBlob, "recorded.mp3");
        // axios.post("http://localhost:5000/upload/byte", body).then((res) => {
        //   console.log(res);
        //   setRecordedUrl(url);
        //   chunks.current = [];
        // });
        setRecordedUrl(url);
        await axios
          .post("http://localhost:5000/upload", formData)
          .then((res) => {
            console.log(res);
          });
        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  return (
    <div>
      <audio controls src={recordedUrl} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};
export default AudioRecorder;
