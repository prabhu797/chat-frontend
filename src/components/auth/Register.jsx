// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"
import { TextField, Button, Typography } from "@mui/material";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "", displayName: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>Register</Typography>
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
        label="Display Name"
        name="displayName"
        fullWidth
        margin="normal"
        value={form.displayName}
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
        Register
      </Button>
    </form>
  );
};

export default Register;
