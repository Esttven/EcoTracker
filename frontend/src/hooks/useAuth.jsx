import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/verify-token", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (response.status === 200) {
          setToken(storedToken);
          setUserId(response.data.userId);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        handleLogout();
      }
    };

    verifyToken();
  }, []);

  const login = (newToken, newUserId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(
          "http://localhost:3000/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      handleLogout();
      navigate("/");
    }
  };

  const value = {
    token,
    userId,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
