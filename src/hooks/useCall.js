// src/hooks/useCall.js
import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";

export const useCall = ({ localVideoRef, remoteVideoRef }) => {
    const [isCalling, setIsCalling] = useState(false);
    const [isInCall, setIsInCall] = useState(false);
    const [remoteUserId, setRemoteUserId] = useState(null);
    const peerConnection = useRef(null);

    const iceServers = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // Add TURN server config if needed
        ],
    };

    const startPeerConnection = async (isInitiator, remoteId, offer = null) => {
        peerConnection.current = new RTCPeerConnection(iceServers);
        setRemoteUserId(remoteId);

        peerConnection.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    to: remoteId,
                    candidate: event.candidate,
                });
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        stream.getTracks().forEach((track) =>
            peerConnection.current.addTrack(track, stream)
        );

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        console.log("Hello 0");
        if (isInitiator) {
            console.log("Hello 1");
            const generatedOffer = await peerConnection.current.createOffer();
            console.log("Hello 2");
            await peerConnection.current.setLocalDescription(generatedOffer);
            socket.emit("call-user", { to: remoteId, offer: generatedOffer });
            setIsCalling(true);
        } else {
            console.log("Hello 3");
            await peerConnection.current.setRemoteDescription(offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer-call", { to: remoteId, answer });
            setIsInCall(true);
        }
    };

    const handleIncomingCall = async ({ from, offer }) => {
        await startPeerConnection(false, from, offer);
    };

    const handleCallAnswered = async ({ answer }) => {
        await peerConnection.current.setRemoteDescription(answer);
        setIsInCall(true);
        setIsCalling(false);
    };

    const handleIceCandidate = async ({ candidate }) => {
        try {
            await peerConnection.current.addIceCandidate(candidate);
        } catch (error) {
            console.error("Error adding ICE candidate", error);
        }
    };

    const endCall = () => {
        socket.emit("end-call", { to: remoteUserId });
        cleanup();
    };

    const cleanup = () => {
        setIsCalling(false);
        setIsInCall(false);
        setRemoteUserId(null);

        if (peerConnection.current) {
            peerConnection.current.getSenders().forEach((sender) => {
                peerConnection.current.removeTrack(sender);
            });
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localVideoRef.current?.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current?.srcObject) {
            remoteVideoRef.current.srcObject.getTracks().forEach((t) => t.stop());
            remoteVideoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-answered", handleCallAnswered);
        socket.on("ice-candidate", handleIceCandidate);
        socket.on("call-ended", cleanup);

        return () => {
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-answered", handleCallAnswered);
            socket.off("ice-candidate", handleIceCandidate);
            socket.off("call-ended", cleanup);
        };
    }, []);

    return {
        isCalling,
        isInCall,
        startCall: (remoteId) => startPeerConnection(true, remoteId),
        endCall,
    };
};
