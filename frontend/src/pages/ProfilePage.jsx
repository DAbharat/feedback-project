import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  console.log(user)
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Add more user info as needed */}
      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;