import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Recorder from "recorder-js";
// import WaveToFlac from "wave-to-flac";

const RecorderComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);

  useEffect(() => {
    // Request access to the microphone
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        },
      })
      .then((stream) => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        recorderRef.current = new Recorder(audioContext, {
          sampleRate: 16000,
          numChannels: 1, // 1 channel
        });
        recorderRef.current.init(stream);
      })
      .catch((err) => {
        console.error("Error accessing microphone", err);
      });
  }, []);

  const startRecording = () => {
    recorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    const { blob } = await recorderRef.current.stop();
    setIsRecording(false);

    // Convert WAV blob to FLAC
    const flacBlob = await convertWavToFlac(blob);
    const formData = new FormData();
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    formData.append("blob_file", flacBlob, "recording.wav");
    await axios.post("http://localhost:5000/upload", formData).then((res) => {
      console.log(res);
    });
    setAudioBlob(flacBlob);
  };

  const convertWavToFlac = async (wavBlob) => {
    const wavArrayBuffer = await wavBlob.arrayBuffer();
    // const flacBuffer = WaveToFlac.encodeFlac(wavArrayBuffer, {
    //   sampleRate: 16000, // 16kHz
    //   compression: 5,
    // });
    return new Blob([wavArrayBuffer], { type: "audio/wav" });
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "recording.flac";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioBlob && <button onClick={downloadAudio}>Download FLAC</button>}
    </div>
  );
};

export default RecorderComponent;
