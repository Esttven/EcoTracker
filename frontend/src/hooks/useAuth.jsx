import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [adminId, setAdminId] = useState(
    parseInt(localStorage.getItem("adminId")) || 0
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        handleLogout();
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/verify-token", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (response.status === 200 && response.data) {
          setToken(storedToken);
          setUserId(response.data.userId);

          // Get user details to verify admin status
          const userResponse = await axios.get(
            `http://localhost:3000/users/${response.data.userId}`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );

          if (userResponse.data) {
            const adminStatus = userResponse.data.adminId;
            setAdminId(adminStatus);
            localStorage.setItem("adminId", adminStatus.toString());
          }

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

  const login = (newToken, newUserId, newAdminId) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    localStorage.setItem("adminId", newAdminId.toString());
    setToken(newToken);
    setUserId(newUserId);
    setAdminId(parseInt(newAdminId));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("adminId");
    setToken(null);
    setUserId(null);
    setAdminId(0);
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
    adminId,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
