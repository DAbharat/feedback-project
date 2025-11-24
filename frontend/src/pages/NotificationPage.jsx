import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../hooks/useNotifications";
import axios from "axios";

// ...existing code...
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
        const rawList = res.data.data || [];

        // normalize read flag: backend uses isRead, frontend uses read
        const list = rawList.map((n) => ({
          ...n,
          read: n.read ?? n.isRead ?? false,
        }));

        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user, setUnreadCount, navigate]);

  // try server mark-read endpoint(s) matching backend routes
  const tryMarkReadOnServer = async (id) => {
    const token = localStorage.getItem("token");
    const endpoints = [
      // this matches your express route: POST /api/v1/notifications/notification-read/:notificationId
      { method: "post", url: `/api/v1/notifications/notification-read/${id}`, data: {} },
      // other fallbacks if API differs
      { method: "patch", url: `/api/v1/notifications/${id}`, data: { isRead: true } },
      { method: "put", url: `/api/v1/notifications/${id}`, data: { isRead: true } },
    ];

    for (const ep of endpoints) {
      try {
        if (ep.method === "post") await axios.post(ep.url, ep.data || {}, { headers: { Authorization: `Bearer ${token}` } });
        else if (ep.method === "patch") await axios.patch(ep.url, ep.data || {}, { headers: { Authorization: `Bearer ${token}` } });
        else if (ep.method === "put") await axios.put(ep.url, ep.data || {}, { headers: { Authorization: `Bearer ${token}` } });
        return true;
      } catch (err) {
        // try next if 404 (endpoint not present), otherwise bail and log
        if (err?.response?.status === 404) continue;
        console.warn("Failed to mark notification as read on server", err);
        return false;
      }
    }
    console.warn("No mark-read endpoint succeeded for notification", id);
    return false;
  };

  const handleNotificationClick = async (notif) => {
    if (!notif) return;

    // optimistic UI update (use functional set to avoid stale state)
    setNotifications((prev) => {
      const next = prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n));
      setUnreadCount(next.filter((n) => !n.read).length);
      return next;
    });

    // notify server (non-blocking)
    try {
      await tryMarkReadOnServer(notif._id);
    } catch (err) {
      console.warn("markRead attempt failed:", err);
    }

    // navigation: prefer explicit url, otherwise infer from relatedModel/relatedId
    if (notif.url) {
      navigate(notif.url);
      return;
    }

    const relatedId = notif.relatedId || notif.related_id || notif.payload?.id || notif.payload?.relatedId;
    const model = (notif.relatedModel || notif.related_model || notif.type || "").toLowerCase();

    if (model.includes("feedback")) {
      if (user?.role === "admin") {
        if (relatedId) navigate(`/admin/feedbacks/${relatedId}`);
        else navigate("/admin/feedbacks");
        return;
      } else {
        if (relatedId) navigate(`/feedback/${relatedId}`);
        else navigate("/feedbacks");
        return;
      }
    }

    if (model.includes("form")) {
      if (user?.role === "admin") {
        if (relatedId) navigate(`/admin/forms/${relatedId}`);
        else navigate("/admin/forms");
      } else {
        if (relatedId) navigate(`/forms/${relatedId}`);
        else navigate("/forms");
      }
      return;
    }

    navigate("/notifications");
  };

  const deleteNotification = async (notifId) => {
    if (!notifId) return;
    const token = localStorage.getItem("token");

    // optimistic remove + unread update
    setNotifications((prev) => {
      const next = prev.filter((n) => n._id !== notifId);
      setUnreadCount(next.filter((n) => !n.read).length);
      return next;
    });

    try {
      await axios.delete(`/api/v1/notifications/notification-delete/${notifId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.warn("Failed to delete notification on server", err);
      // restore by refetching a fresh list
      try {
        const res = await axios.get(`/api/v1/notifications/${user._id}?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rawList = res.data.data || [];
        const list = rawList.map((n) => ({ ...n, read: n.read ?? n.isRead ?? false }));
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.read).length);
      } catch (e) {
        console.error("Failed to restore notifications after delete failure", e);
      }
    }
  };

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
        <h2 className="text-4xl font-extrabold mb-10 mt-1 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">
          Notifications
        </h2>

        {notifications.length === 0 ? (
          <div className="text-gray-400 text-center font-semibold py-8">No notifications found.</div>
        ) : (
          <ul className="w-full max-w-3xl space-y-4">
            {notifications.map((notif) => (
              <li key={notif._id} className="w-full">
                <div
                  className={`w-full px-4 py-3 rounded-xl flex items-start justify-between gap-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 shadow-lg border border-gray-800/60 transition-shadow duration-150
                    ${notif.read ? "hover:shadow-xl" : "ring-2 ring-purple-500/40 hover:shadow-2xl"}`}
                >
                  <button
                    onClick={() => handleNotificationClick(notif)}
                    className="flex-1 text-left pr-4"
                    aria-label="Open notification"
                  >
                    <div className="text-white text-base font-medium break-words">{notif.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
                  </button>

                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                      title="Delete notification"
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800/80 hover:bg-red-600 text-gray-300 hover:text-white transition"
                      aria-label="Delete notification"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
// ...existing code...