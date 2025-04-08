// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"
import { TextField, Button, Typography } from "@mui/material";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Username"
        name="username"
        fullWidth
        margin="normal"
        value={form.username}
        onChange={handleChange}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </form>
  );
};

export default Login;
