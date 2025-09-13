import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../hooks/useNotifications";
import axios from "axios";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { setUnreadCount } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/register");
      return;
    }
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/notifications/${user._id}?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.data || []);
        setUnreadCount(0); // reset badge
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user, setUnreadCount, navigate]);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif._id} className="p-2 border rounded bg-gray-50">
              <div>{notif.message}</div>
              <div className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationPage;
