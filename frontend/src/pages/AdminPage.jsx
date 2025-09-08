import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      console.error("Access denied. Admins only.");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/users/teachers", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTeachers(res.data.data || []);
    } catch (err) {
      setError("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (teacherId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/v1/users/make-admin/${teacherId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setTeachers(teachers.filter((t) => t._id !== teacherId));
      alert("Teacher promoted to admin!");
    } catch (err) {
      alert("Failed to promote teacher");
    }
  };

  if (loading) return <div>Loading teachers...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Teachers</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={fetchTeachers}
        disabled={loading}
      >
        {loading ? "Loading..." : "Show All Teachers"}
      </button>
      {teachers.length === 0 ? (
        <div>No teachers found.</div>
      ) : (
        <ul className="space-y-2">
          {teachers.map((teacher) => (
            <li
              key={teacher._id}
              className="p-2 border rounded flex justify-between items-center"
            >
              <span>
                {teacher.fullName} ({teacher.email})
              </span>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleMakeAdmin(teacher._id)}
              >
                Make Admin
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPage;
