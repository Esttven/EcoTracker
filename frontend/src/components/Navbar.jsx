import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Inicio</Link>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;