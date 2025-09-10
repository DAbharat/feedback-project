import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });


  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("/api/v1/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data?.data) setUser(res.data.data);
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const login = (userData) => setUser(userData);
  const logout = async () => {
  try {
    const token = localStorage.getItem('token'); 
    await axios.post(
      '/api/v1/users/logout', 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed. Please try again.");
  }
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}