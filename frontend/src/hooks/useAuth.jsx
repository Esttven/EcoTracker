import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(!!token);
  }, [token, userId]);

  const login = (newToken, newUserId) => {
    setToken(newToken);
    setUserId(newUserId);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setToken(null);
      setUserId(null);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);