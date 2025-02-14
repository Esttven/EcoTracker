import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./navbar.css";

const Navbar = () => {
  const { isAuthenticated, adminId, logout } = useAuth();

  console.log("Auth state:", { isAuthenticated, adminId });

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">EcoTracker</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {adminId === 1 && (
                <div className="dropdown">
                  <button className="dropbtn">Admin</button>
                  <div className="dropdown-content">
                    <Link to="/auditlogs">Auditoría</Link>
                  </div>
                </div>
              )}
              <button className="navbar-btn" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
