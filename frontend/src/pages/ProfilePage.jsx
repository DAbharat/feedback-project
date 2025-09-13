import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  console.log(user)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex justify-center items-center px-4" style={{height: '100vh'}}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      {/* Cyber grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-md flex flex-col justify-center">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-1 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">{user.fullName}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <div className="flex flex-col gap-2 mb-8">
            {/* Add more user info as needed */}
            {/* Example: <p className="text-gray-300"><strong>Role:</strong> {user.role}</p> */}
          </div>
          <button
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-400/40 transition-all duration-300 transform hover:scale-105 mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* Floating decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  );
}

export default ProfilePage;