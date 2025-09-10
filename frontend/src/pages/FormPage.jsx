
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/forms/forms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForms(res.data.data || []);
    } catch (err) {
      setError("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchForms();
    }
    // eslint-disable-next-line
  }, [user]);

  if (!user) return <div className="p-4">Access denied.</div>;

  const visibleForms = user.role === "student"
    ? forms.filter(f => f.isActive)
    : forms;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Available Feedback Forms</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={fetchForms} disabled={loading}>
        {loading ? "Loading..." : "Refresh"}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Questions</th>
              <th className="p-2 border">Active</th>
              <th className="p-2 border">Deadline</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleForms.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">No forms found.</td></tr>
            ) : (
              visibleForms.map(form => (
                <tr key={form._id}>
                  <td className="p-2 border">{form.title}</td>
                  <td className="p-2 border">{form.description || "-"}</td>
                  <td className="p-2 border">{form.questions?.length || 0}</td>
                  <td className="p-2 border">{form.isActive ? "Yes" : "No"}</td>
                  <td className="p-2 border">{form.deadline ? new Date(form.deadline).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border">
                    {user.role === "student" && form.isActive && (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => navigate(`/form/${form._id}`)}
                      >
                        Fill Form
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FormPage;