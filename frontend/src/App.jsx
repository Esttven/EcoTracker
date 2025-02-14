import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AuditLogs from "./components/AuditLogs";
import ManageUsers from "./components/ManageUsers";
import ManageAppliances from "./components/ManageAppliances";
import { AuthProvider } from "./hooks/useAuth.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auditlogs" element={<AuditLogs />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/manage-appliances" element={<ManageAppliances />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
