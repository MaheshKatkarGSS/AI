import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

function RecordRtcRecorder({ setResponse }) {
  let rtcmediaStream = useRef(null);
  const [rtcMediaStream, setRtcMediaStream] = useState();
  const [disablestoprecording, setDisableStopRecording] = useState(true);
  const [disablestartrecorind, setDisableStartRecording] = useState(false);
  const startRecording = () => {
    setDisableStartRecording(true);
    setDisableStopRecording(false);
    navigator.getUserMedia(
      {
        audio: true,
      },
      function (stream) {
        //5)
        setRtcMediaStream(
          RecordRTC(stream, {
            type: "audio",

            //6)
            mimeType: "audio/webm",
            sampleRate: 44100,
            // used by StereoAudioRecorder
            // the range 22050 to 96000.
            // let us force 16khz recording:
            desiredSampRate: 16000,

            // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
            // CanvasRecorder, GifRecorder, WhammyRecorder
            recorderType: StereoAudioRecorder,
            // Dialogflow / STT requires mono audio
            numberOfAudioChannels: 1,
          })
        );
      },
      function (error) {
        console.error(JSON.stringify(error));
      }
    );
  };

  useEffect(() => {
    if (rtcMediaStream) {
      rtcMediaStream.startRecording();
    }
  }, [rtcMediaStream]);

  const stopRecording = () => {
    console.log(stopRecording);
    setDisableStartRecording(false);
    setDisableStopRecording(true);
    rtcMediaStream.stopRecording(function () {
      // after stopping the audio, get the audio data
      rtcMediaStream.getDataURL(function (audioDataURL) {
        //2)
        var files = {
          audio: {
            type: rtcMediaStream.getBlob().type || "audio/wav",
            dataURL: audioDataURL,
          },
        };
        rtcmediaStream = files;
        // submit the audio file to the server
        const formData = new FormData();
        console.log(files);
        formData.append("blob_file", rtcMediaStream.getBlob(), "recording.wav");
        axios.post("http://localhost:5000/upload", formData).then((res) => {
          console.log(res);
          setResponse((prev) => prev + res.data);
        });
      });
    });
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={startRecording}
        disabled={disablestartrecorind}
      >
        start recording
      </Button>
      <Button
        onClick={stopRecording}
        variant="contained"
        disabled={disablestoprecording}
      >
        stop recording
      </Button>
    </>
  );
}

export default RecordRtcRecorder;
