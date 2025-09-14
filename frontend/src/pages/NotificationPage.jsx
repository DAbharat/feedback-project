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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-white text-center">
          Loading notifications...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-red-400 text-center">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-2 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-10 mt-1 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">Notifications</h2>
        {notifications.length === 0 ? (
          <div className="text-gray-400 text-center font-semibold py-8">No notifications found.</div>
        ) : (
          <ul className="w-full max-w-3xl space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`w-full px-6 py-5 rounded-xl flex flex-col gap-1 bg-gradient-to-r from-gray-800/80 to-gray-900/80 shadow-lg border border-gray-800/60 ${notif.read ? '' : 'ring-2 ring-purple-500/40'}`}
              >
                <div className="text-white text-base font-medium break-words">{notif.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
