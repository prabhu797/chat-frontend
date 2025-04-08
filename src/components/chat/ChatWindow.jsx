// src/components/chat/ChatWindow.jsx
import { Box, Typography, Paper } from "@mui/material";

const ChatWindow = ({ messages = [], selectedUser }) => {
  return (
    <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
      {selectedUser ? (
        <>
          <Typography variant="h6" mb={2}>
            Chatting with {selectedUser.displayName}
          </Typography>
          {messages.map((msg, index) => (
            <Paper
              key={index}
              sx={{
                mb: 1,
                p: 1.5,
                alignSelf: msg.isOwn ? "flex-end" : "flex-start",
                bgcolor: msg.isOwn ? "primary.light" : "grey.200",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </Paper>
          ))}
        </>
      ) : (
        <Typography variant="h6">Select a contact to start chatting</Typography>
      )}
    </Box>
  );
};

export default ChatWindow;
