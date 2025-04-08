import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/auth/register", {
      username,
      displayName,
      password,
    });

    // Auto-login after registration
    const res = await axios.post("/auth/login", { username, password });
    login(res.data.user, res.data.token);
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;
