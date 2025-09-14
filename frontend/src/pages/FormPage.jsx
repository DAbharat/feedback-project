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
  const [submittedForms, setSubmittedForms] = useState([]);

  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const [formsRes, submittedRes] = await Promise.all([
        axios.get("/api/v1/forms/forms", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/v1/form-responses/submitted-forms", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setForms(formsRes.data.data || []);
      setSubmittedForms(submittedRes.data.data || []);
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

  // Sort: unfilled (newest first) at top, filled (newest first) at bottom
  const sortedForms = [...visibleForms].sort((a, b) => {
    const aFilled = submittedForms.includes(a._id);
    const bFilled = submittedForms.includes(b._id);
    if (aFilled === bFilled) {
      // Newest first by deadline (or createdAt if available)
      const aDate = a.deadline ? new Date(a.deadline) : new Date(0);
      const bDate = b.deadline ? new Date(b.deadline) : new Date(0);
      return bDate - aDate;
    }
    return aFilled ? 1 : -1; // unfilled first
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-2 py-8">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-10 mt-8 gap-4">
          <h2 className="text-4xl font-extrabold text-center sm:text-left bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow m-0">Available Feedback Forms</h2>
          <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-4 py-2 mr-1 rounded-xl shadow-md transition duration-200 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
            onClick={fetchForms}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        {error && <div className="text-red-400 font-semibold text-center sm:text-left mb-4">{error}</div>}
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="min-w-full bg-gray-900/80 rounded-2xl overflow-hidden text-white shadow-lg">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 via-gray-900 to-slate-900 text-purple-200">
                <th className="p-4 font-bold text-left">Title</th>
                <th className="p-4 font-bold text-left">Description</th>
                <th className="p-4 font-bold text-center">Questions</th>
                <th className="p-4 font-bold text-center">Active</th>
                <th className="p-4 font-bold text-center">Deadline</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedForms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500 font-semibold">No forms found.</td>
                </tr>
              ) : (
                sortedForms.map(form => {
                  const alreadySubmitted = submittedForms.includes(form._id);
                  return (
                    <tr key={form._id} className="hover:bg-gray-800/60 transition">
                      <td className="p-4 border-b border-gray-800 font-semibold text-white">{form.title}</td>
                      <td className="p-4 border-b border-gray-800 text-gray-300">{form.description || "-"}</td>
                      <td className="p-4 border-b border-gray-800 text-center">{form.questions?.length || 0}</td>
                      <td className="p-4 border-b border-gray-800 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${form.isActive ? 'bg-green-700/20 text-green-300' : 'bg-gray-700/40 text-gray-400'}`}>{form.isActive ? "Yes" : "No"}</span>
                      </td>
                      <td className="p-4 border-b border-gray-800 text-center">{form.deadline ? new Date(form.deadline).toLocaleDateString() : "-"}</td>
                      <td className="p-4 border-b border-gray-800 text-center">
                        {user.role === "student" && form.isActive && (
                          <button
                            className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-1.5 rounded-lg font-bold shadow transition duration-200 ${alreadySubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !alreadySubmitted && navigate(`/form/${form._id}`)}
                            disabled={alreadySubmitted}
                          >
                            {alreadySubmitted ? 'Filled' : 'Fill Form'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FormPage;