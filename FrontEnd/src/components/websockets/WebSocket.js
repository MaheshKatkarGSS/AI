import { Button, Grid, Input, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function WebSocketImpl() {
  const [ws, setWs] = useState();
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const connectToSocket = () => {
    const websocket = new WebSocket(
      `ws://localhost:8000/ws/${Math.floor(Math.random() * 99999)}`
    );
    websocket.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data]);
      console.log(e);
    };
    setWs(websocket);
  };

  const sendMessage = () => {
    if (ws) {
      console.log("message sent");
      ws.send(message);
      setMessage();
    }
  };

  return (
    <>
      <Grid pt={2}>
        <Button pt={2} variant="contained" onClick={connectToSocket}>
          Connect
        </Button>
        <Input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></Input>
        <Button pt={2} variant="contained" onClick={sendMessage}>
          Send Message
        </Button>
        <Grid>
          {messages.reverse().map((e) => (
            <Typography>{e}</Typography>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default WebSocketImpl;
