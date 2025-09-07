import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profile"); 
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await api.post("/users/login", { email, password });
    console.log("Login response:", res.data);
    login(res.data.data.user);
    //localStorage.setItem("user", JSON.stringify(res.data.user)); 
    localStorage.setItem("token", res.data.data.accessToken); 
    navigate("/");
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Please check your credentials and try again.");
  }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 flex flex-col gap-4">
      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white p-2 rounded" type="submit">
        Login
      </button>
    </form>
  );
}

export default LoginPage;