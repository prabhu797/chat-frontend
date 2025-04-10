import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";

export const useCall = ({ localVideoRef, remoteVideoRef }) => {
    const [isCalling, setIsCalling] = useState(false);
    const [isInCall, setIsInCall] = useState(false);
    const [remoteUserId, setRemoteUserId] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null); // { from, offer, callType }
    const peerConnection = useRef(null);
    const pendingCandidates = useRef([]);

    const iceServers = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // Add TURN server config if needed
        ],
    };

    const startPeerConnection = async (isInitiator, remoteId, offer = null, callType) => {
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
                    callType: callType
                });
            }
        };

        const constraints = callType === "audio" ? { audio: true, video: false } : { audio: true, video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) =>
            peerConnection.current.addTrack(track, stream)
        );

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        if (isInitiator) {
            const generatedOffer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(generatedOffer);
            socket.emit("call-user", { to: remoteId, offer: generatedOffer, callType: callType });
            setIsCalling(true);
        } else {
            await peerConnection.current.setRemoteDescription(offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer-call", { to: remoteId, answer, callType: callType });
            setIsInCall(true);

            // ⬇️ Process any queued ICE candidates
            for (const candidate of pendingCandidates.current) {
                try {
                    await peerConnection.current.addIceCandidate(candidate);
                } catch (error) {
                    console.error("Error adding queued ICE candidate", error);
                }
            }
            pendingCandidates.current = [];
        }
    };

    const handleIncomingCall = async ({ from, offer, callType }) => {
        setIncomingCall({ from, offer, callType });
    };

    const acceptCall = async () => {
        if (!incomingCall) return;
        await startPeerConnection(false, incomingCall.from, incomingCall.offer, incomingCall.callType);
        setIncomingCall(null);
    };

    const rejectCall = () => {
        if (incomingCall) {
            socket.emit("end-call", { to: incomingCall.from });
            setIncomingCall(null);
        }
    };

    const handleCallAnswered = async ({ answer }) => {
        await peerConnection.current.setRemoteDescription(answer);
        setIsInCall(true);
        setIsCalling(false);

        // ⬇️ Process any queued ICE candidates
        for (const candidate of pendingCandidates.current) {
            try {
                await peerConnection.current.addIceCandidate(candidate);
            } catch (error) {
                console.error("Error adding queued ICE candidate", error);
            }
        }
        pendingCandidates.current = [];
    };

    const handleIceCandidate = async ({ candidate, callType }) => {
        if (
            peerConnection.current &&
            peerConnection.current.remoteDescription &&
            peerConnection.current.remoteDescription.type
        ) {
            try {
                await peerConnection.current.addIceCandidate(candidate);
            } catch (error) {
                console.error("Error adding ICE candidate", error);
            }
        } else {
            // Queue ICE candidate until remote description is set
            pendingCandidates.current.push(candidate);
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

        pendingCandidates.current = [];
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
        startCall: (remoteId, callType) => startPeerConnection(true, remoteId, null, callType),
        endCall,
        incomingCall,
        acceptCall,
        rejectCall,
    };
};
