import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { unreadCount, markAllAsRead } = useNotifications();
  const auth = useAuth();
  const user = auth && auth.user ? auth.user : null;

  const handleNotificationClick = () => {
    markAllAsRead();
    navigate("/notifications");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 backdrop-blur-lg border-b border-gray-700/50 text-white px-6 py-4 relative shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none"></div>
      
      <div className="relative flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Feedback Portal
          </span>
        </div>

        {/* Center Navigation Links */}
        <div className="flex items-center space-x-1">
          <Link 
            to="/" 
            className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold">Home</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
          </Link>

          <Link 
            to="/feedback" 
            className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
              </svg>
              <span className="font-semibold">Feedback</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
          </Link>

          {/* Forms Dropdown for Admin */}
          {user && user.role === "admin" ? (
            <div className="relative group">
              <button
                className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm flex items-center space-x-2"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">Forms</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-gray-800 text-white rounded-t-xl"
                  onClick={() => navigate("/admin/form-responses")}
                >
                  See Responses
                </button>
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-gray-800 text-white rounded-b-xl"
                  onClick={() => navigate("/admin/forms/create-form")}
                >
                  Create Form
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/forms" 
              className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">Forms</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
            </Link>
          )}

          <Link 
            to="/about" 
            className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
              </svg>
              <span className="font-semibold">About</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
          </Link>
          
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications Button */}
          <button 
            className="group relative p-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm" 
            onClick={handleNotificationClick} 
            title="Notifications"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 3h16a2 2 0 012 2v6a2 2 0 01-2 2h-7l-4 4V13H4a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs px-2 py-0.5 font-bold shadow-lg animate-pulse min-w-[1.25rem] h-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
          </button>

          {/* Profile Button */}
          <Link 
            to="/profile"
            className="group relative p-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
          </Link>

          {/* Optional: Mobile menu button for responsive design */}
          <button className="md:hidden group relative p-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </nav>
  );
}

export default Navbar;