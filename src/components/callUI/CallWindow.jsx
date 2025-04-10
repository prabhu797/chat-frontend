// src/components/CallWindow.jsx
import React, { useRef } from "react";
import { useCall } from "../../hooks/useCall";
import { Button } from "@mui/material";

const CallWindow = ({ remoteUserId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const {
    isCalling,
    isInCall,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  } = useCall({ localVideoRef, remoteVideoRef });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-black rounded" />
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black rounded" />
      </div>
      <div className="flex gap-4">
        {!isInCall && (
          <>
            <Button
              variant="contained"
              onClick={() => startCall(remoteUserId, "audio")}
              disabled={isCalling}
            >
              {isCalling ? "Calling..." : "Voice Call"}
            </Button>
            <Button
              variant="contained"
              onClick={() => startCall(remoteUserId, "video")}
              disabled={isCalling}
            >
              {isCalling ? "Calling..." : "Video Call"}
            </Button>
          </>
        )}
        {isInCall && (
          <Button variant="outlined" color="error" onClick={endCall}>
            End Call
          </Button>
        )}
        {incomingCall && (
          <div className="bg-white shadow-lg rounded p-4">
            <p>📞 Incoming {incomingCall.callType} call...</p>
            <div className="flex gap-2 mt-2">
              <Button variant="contained" onClick={acceptCall}>Accept</Button>
              <Button variant="outlined" color="error" onClick={rejectCall}>Reject</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallWindow;
