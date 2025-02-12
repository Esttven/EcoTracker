import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  return (
    <div className="home-container animated-bg">
      <h1 className="fade-in">Bienvenido a EcoTracker 🌿</h1>
      <p className="fade-in">Calcula tu huella de carbono y aprende cómo reducir tu impacto ambiental.</p>

      <div className="info-cards fade-in">
        <div className="info-card">
          <p>🌍 Reducir las emisiones de carbono es esencial para proteger nuestro planeta y garantizar un futuro sostenible.</p>
        </div>
        <div className="info-card">
          <p>⚡ EcoTracker te ayuda a monitorear el uso de tus electrodomésticos y mejorar tus hábitos energéticos.</p>
        </div>
        <div className="info-card">
          <p>🌱 ¿Quieres cambiar tus hábitos y contribuir a un futuro más verde? ¡Únete a nosotros ahora!</p>
        </div>
      </div>

      <Link to="/register">
        <button className="btn-primary fade-in">¡Comenzar ahora!</button>
      </Link>
    </div>
  );
};

export default Home;
