import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "react-hot-toast";

// .env Structure
// VITE_BACKEND_URL="http://localhost:5000"
// VITE_API_URL="http://localhost:5000"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/chat-frontend'>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    <Toaster position="top-right" />
  </React.StrictMode>
);
