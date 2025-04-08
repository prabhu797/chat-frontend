// components/chat/ChatSidebar.jsx
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Box,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { showToast } from "../../utils/toast";

const ChatSidebar = ({ currentUser, selectedUserId, onUserSelect }) => {
    const [friends, setFriends] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchFriends();
        fetchRequests();
    }, []);

    const fetchFriends = async () => {
        try {
            const res = await axios.get("/friends");
            setFriends(res.data);
        } catch (err) {
            showToast("error", "Failed to load friends.");
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get("/friends/requests");
            setRequests(res.data);
        } catch (err) {
            showToast("error", "Failed to load requests.");
        }
    };

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (!value) return setSearchResults([]);

        try {
            const res = await axios.get(`/users?search=${value}`);
            setSearchResults(res.data);
        } catch (err) {
            showToast("error", "Search failed.");
        }
    };

    const sendRequest = async (userId) => {
        try {
            await axios.post("/friends/request", { userId });
            showToast("success", "Friend request sent.");
        } catch (err) {
            showToast("error", "Failed to send request.");
        }
    };

    const handleAccept = async (userId) => {
        try {
            await axios.post("/friends/accept", { userId });
            showToast("success", "Friend request accepted.");
            fetchRequests();
            fetchFriends();
        } catch (err) {
            showToast("error", "Failed to accept.");
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.post("/friends/reject", { userId });
            showToast("success", "Friend request rejected.");
            fetchRequests();
        } catch (err) {
            showToast("error", "Failed to reject.");
        }
    };

    return (
        <Box sx={{ width: 300, borderRight: "1px solid #ccc", overflowY: "auto" }}>
            {/* Friends */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Friends</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {friends.map((friend) => (
                            <ListItem
                                key={friend._id}
                                button
                                selected={friend._id === selectedUserId}
                                onClick={() => onUserSelect(friend)}
                            >
                                <ListItemText primary={friend.displayName || friend.username} />
                            </ListItem>
                        ))}
                        {friends.length === 0 && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                No friends yet.
                            </Typography>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>

            {/* Search */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Search Users</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search by username"
                        value={search}
                        onChange={handleSearch}
                    />
                    <List>
                        {searchResults.map((user) => (
                            <ListItem key={user._id} secondaryAction={
                                <IconButton edge="end" onClick={() => sendRequest(user._id)}>
                                    <PersonAddIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>

            {/* Requests */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Requests</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {requests.map((req) => (
                            <ListItem key={req.from._id}>
                                <ListItemText primary={req.from.displayName || req.from.username} />
                                <IconButton onClick={() => handleAccept(req.from._id)}>
                                    ✅
                                </IconButton>
                                <IconButton onClick={() => handleReject(req.from._id)}>
                                    ❌
                                </IconButton>
                            </ListItem>
                        ))}
                        {requests.length === 0 && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                No incoming requests.
                            </Typography>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ChatSidebar;
