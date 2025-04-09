// src/components/CallWindow.jsx
import React, { useRef } from "react";
import { useCall } from "../../hooks/useCall";
import { Button } from "@mui/material";

const CallWindow = ({ remoteUserId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { isCalling, isInCall, startCall, endCall } = useCall({
    localVideoRef,
    remoteVideoRef,
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black rounded" />
      </div>
      <div className="flex gap-4">
        {!isInCall && (
          <Button variant="contained" onClick={() => startCall(remoteUserId)} disabled={isCalling}>
            {isCalling ? "Calling..." : "Start Call"}
          </Button>
        )}
        {isInCall && (
          <Button variant="outlined" color="error" onClick={endCall}>
            End Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default CallWindow;
