import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth, googleProvider } from "../config/firebaseConfigFront";
import { signInWithPopup } from "firebase/auth";
import "./auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/register", {
        email,
        password,
        username,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering:", error);
      alert("Error al registrarse");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      console.log("Google sign in successful:", {
        email: result.user.email,
        uid: result.user.uid,
      });

      const response = await axios.post("http://localhost:3000/google-auth", {
        token,
        email: result.user.email,
        userId: result.user.uid,
      });

      if (response.data.user && response.data.token) {
        login(
          response.data.token,
          response.data.user.id,
          response.data.user.adminId
        );
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(
        "Error registering with Google:",
        error.response?.data || error
      );
      alert(
        "Error al registrarse con Google: " +
          (error.response?.data?.details || error.message)
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Registrarse</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de usuario:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Correo electrónico:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Registrarse
          </button>
        </form>
        <div className="auth-divider">
          <span>O</span>
        </div>
        <button onClick={handleGoogleLogin} className="google-btn">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
            alt="Google logo"
          />
          Registrarse con Google
        </button>
      </div>
    </div>
  );
};

export default Register;
