import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="home-container animated-bg">
      <div className="title-card">
        <h1 className="fade-in">Bienvenido a EcoTracker 🌿</h1>
      </div>
      <p className="fade-in">
        Calcula tu huella de carbono y aprende cómo reducir tu impacto
        ambiental.
      </p>

      <div className="info-cards fade-in">
        <div className="info-card">
          <p>
            🌍 Reducir las emisiones de carbono es esencial para proteger
            nuestro planeta y garantizar un futuro sostenible.
          </p>
        </div>
        <div className="info-card">
          <p>
            ⚡ EcoTracker te ayuda a monitorear el uso de tus electrodomésticos
            y mejorar tus hábitos energéticos.
          </p>
        </div>
        <div className="info-card">
          <p>
            🌱 ¿Quieres cambiar tus hábitos y contribuir a un futuro más verde?
            ¡Únete a nosotros ahora!
          </p>
        </div>
      </div>

      <button className="btn-primary fade-in" onClick={handleButtonClick}>
        ¡Comenzar ahora!
      </button>
    </div>
  );
};

export default Home;