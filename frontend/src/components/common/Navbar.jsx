import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";

function Navbar() {
  const navigate = useNavigate();
  const { unreadCount, markAllAsRead } = useNotifications();

  const handleNotificationClick = () => {
    markAllAsRead();
    navigate("/notifications");
  };

  return (
    <nav className="bg-gray-800 text-white p-5 flex items-center relative">
      <div className="absolute left-4"></div>
      <div className="flex-1 flex justify-center gap-8 text-lg font-semibold">
        <Link to="/">Home</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/forms">Forms</Link>
      </div>
      <div className="absolute right-6 flex items-center gap-4">
        <button className="relative" onClick={handleNotificationClick} title="Notifications">
          <i className="fa-solid fa-bell text-xl"></i>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
              {unreadCount}
            </span>
          )}
        </button>
        <Link to="/profile">
          <i className="fa-solid fa-user text-xl"></i>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;