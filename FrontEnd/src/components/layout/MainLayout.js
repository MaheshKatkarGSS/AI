import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Transcriptions from "../views/Transcriptions";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import RecorderComponent from "../AudioRecorder/FlacRecorder";
import RecordRtcRecorder from "../AudioRecorder/RecorRtcRecorder";

function MainLayout() {
  const [response, setResponse] = useState("");
  //   const [mediaRecorder, setMediaRecorder] = useState();
  //   const getAudio = () => {
  //     let audioIN = { audio: true };
  //     navigator.mediaDevices.getUserMedia(audioIN).then((mediaStreamObject) => {
  //       setMediaRecorder(new MediaRecorder(mediaStreamObject));
  //     });
  //   };

  //   const startRecording = () => {
  //     mediaRecorder.start();
  //   };

  //   const stopRecording = () => {
  //     mediaRecorder.stop();
  //   };

  return (
    <>
      <Grid container spacing={2} padding={5}>
        <Grid md={9} alignContent={"center"} textAlign={"center"}>
          <Typography>Camera View</Typography>
        </Grid>
        <Grid md={3}>
          <Transcriptions response={response} />
          <AudioRecorder />
          <RecorderComponent />
          <RecordRtcRecorder setResponse={setResponse} />
        </Grid>
      </Grid>
    </>
  );
}

export default MainLayout;
