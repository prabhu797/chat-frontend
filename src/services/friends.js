import axios from "../utils/axios";

// Fetch all friends of the logged-in user
export const fetchFriends = async () => {
    const res = await axios.get("/friends");
    return res.data;
};

// Search users by name
export const searchUsers = async (query) => {
    const res = await axios.get(`/users?search=${query}`);
    return res.data;
};

// Add a friend
export const addFriend = async (friendId) => {
    const res = await axios.post(`/friends/add/${friendId}`);
    return res.data;
};
