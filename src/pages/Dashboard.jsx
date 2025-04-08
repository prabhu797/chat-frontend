// src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import { useAuth } from "../context/AuthContext";
import { socket } from "../utils/socket";
import axios from "../utils/axios"

const Dashboard = () => {
    const { user } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);

    // Socket listener
    useEffect(() => {
        if (!socket) return;

        socket.on("receive-message", ({ from, message }) => {
            setMessages((prev) => [
                ...prev,
                { text: message, isOwn: false, from },
            ]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, []);

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        try {
            const res = await axios.get(`/messages/${user._id}`);
            const chatHistory = res.data.map((msg) => ({
                text: msg.message,
                isOwn: msg.sender === user._id, // or user._id depending on format
                from: msg.sender,
            }));
            setMessages(chatHistory.reverse()); // display in correct order
        } catch (err) {
            console.error("Failed to load messages", err);
        }
    };

    const handleSendMessage = (text) => {
        if (!selectedUser) return;

        const msg = {
            text,
            isOwn: true,
            to: selectedUser.id,
        };

        setMessages((prev) => [...prev, msg]);

        socket.emit("send-message", {
            to: selectedUser._id,
            message: text,
        });
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <ChatSidebar
                currentUser={user}
                selectedUserId={selectedUser?.id}
                onUserSelect={handleUserSelect}
            />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <ChatWindow messages={messages} selectedUser={selectedUser} />
                {selectedUser && <MessageInput onSend={handleSendMessage} />}
            </Box>
        </Box>
    );
};

export default Dashboard;
