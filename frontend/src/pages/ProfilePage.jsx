import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
// ...existing code...
function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState(user?.idCard || "");
  const [uploading, setUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setAvatarUrl(user.idCard || "");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!isPreviewOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPreviewOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);

    await uploadImage(file);
    setTimeout(() => URL.revokeObjectURL(preview), 10000);
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await axios.post("/api/v1/users/me/avatar", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newUrl =
        res.data?.data?.avatarUrl || res.data?.avatarUrl || res.data?.data?.idCard || res.data?.idCard;

      if (newUrl) {
        setAvatarUrl(newUrl);

        if (typeof setUser === "function") {
          setUser({ ...user, idCard: newUrl });
        }
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  console.log(user);
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex justify-center items-center px-4" style={{ height: "100vh" }}>
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
          <div className="flex flex-col items-center mb-6 relative">
            <div className="relative mb-4">
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full shadow-lg shadow-purple-500/25 overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
                    </svg>
                  </div>
                )}
              </div>

              {/* Camera button OUTSIDE, not clipped */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleAvatarClick(); }} /* prevent opening preview */
                className="absolute bottom-0 right-0 translate-x-2 translate-y-2 
               w-8 h-8 bg-gray-800/90 border border-gray-700 rounded-full 
               flex items-center justify-center text-white hover:bg-gray-700 
               transition-shadow shadow-xl"
              >
                {uploading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l2-3h6l2 3h4v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                )}
              </button>

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {isPreviewOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setIsPreviewOpen(false)} role="dialog" aria-modal="true"   >     <div className="relative max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="absolute top-2 right-2 z-20 w-10 h-10 rounded-full bg-gray-900/80 border border-gray-700 flex items-center justify-center text-white hover:bg-gray-800"
                  aria-label="Close preview"       >         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={avatarUrl} alt="Avatar preview" className="rounded-xl object-contain max-h-[80vh] w-auto mx-auto block"
                />
              </div>   </div>)}
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