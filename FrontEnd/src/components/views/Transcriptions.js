import { Grid2, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
function Transcriptions({ response }) {
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setTranscriptions((prev) => [...prev, `This is 1000 th dialog`]);
    }
  }, []);
  return (
    <>
      <Grid2>
        {/* {transcriptions.map((e) => (
          <>
            <Grid2>
              <Typography>{e}</Typography>
            </Grid2>
          </>
        ))} */}
        <Grid2>
          <Typography>{response}</Typography>
        </Grid2>
      </Grid2>
    </>
  );
}

export default Transcriptions;
