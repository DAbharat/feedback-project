
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


function AdminFeedbackResponses() {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formId, setFormId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [forms, setForms] = useState([]);
  // Fetch all forms for dropdown
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/forms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForms(res.data.data || []);
      } catch (err) {
        // ignore error
      }
    };
    if (user && (user.role === "admin" || user.role === "teacher")) {
      fetchForms();
    }
  }, [user]);

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = { page, formId, studentId };
      const res = await axios.get("/api/v1/form-responses/responses/all", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setResponses(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);

      // Fetch analytics if formId is set
      if (formId) {
        const analyticsRes = await axios.get(`/api/v1/form-responses/responses/analytics/${formId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(analyticsRes.data.data || []);
      } else {
        setAnalytics([]);
      }
    } catch (err) {
      setError("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch responses on Search button click or pagination
  useEffect(() => {
    // Fetch initial data only if needed (optional: comment out to not auto-load anything)
    // if (user && (user.role === "admin" || user.role === "teacher")) {
    //   fetchResponses();
    // }
    // eslint-disable-next-line
  }, []);

  // When page changes, fetch with current filters
  useEffect(() => {
    if (page !== 1) {
      fetchResponses();
    }
    // eslint-disable-next-line
  }, [page]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (formId) params.append("formId", formId);
      const url = `/api/v1/forms/responses/export?${params.toString()}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", "responses.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert("Failed to export CSV");
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "teacher")) return <div>Access denied.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 px-2">
      <h2 className="text-3xl font-extrabold mb-10 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">Feedback Responses</h2>
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Filter/Search Controls */}
        <div className="flex-1 bg-gray-900/80 rounded-2xl shadow-xl p-6 border border-gray-800 mb-8 md:mb-0 flex flex-col gap-6 min-w-[300px] max-w-md mx-auto md:mx-0">
          <div className="flex flex-col gap-4">
            <label className="text-purple-200 font-semibold">Select Form</label>
            <select
              className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formId}
              onChange={e => setFormId(e.target.value)}
            >
              <option value="">Select Form</option>
              {forms.map(form => (
                <option key={form._id} value={form._id}>
                  {form.title} ({form.course}, {form.year}, Sem {form.semester}{form.specialization ? `, ${form.specialization}` : ""})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-purple-200 font-semibold">Filter by Student ID</label>
            <input
              className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-bold shadow transition"
              onClick={() => {
                setPage(1);
                fetchResponses();
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow transition" onClick={handleExport}>
              Export CSV
            </button>
          </div>
          {error && <div className="text-red-400 font-semibold text-center mt-2">{error}</div>}
        </div>
        {/* Analytics and Table */}
        <div className="flex-[2] flex flex-col gap-8">
          {/* Analytics Section */}
          {analytics.length > 0 && (
            <div className="bg-gray-900/80 rounded-2xl shadow-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-200">Analytics (Average Rating per Question)</h3>
              <table className="min-w-full bg-gray-900/80 rounded-xl text-white shadow mb-2">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 via-gray-900 to-slate-900 text-purple-200">
                    <th className="p-3 font-bold">Question</th>
                    <th className="p-3 font-bold">Average Rating</th>
                    <th className="p-3 font-bold">Responses</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((a, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/60 transition">
                      <td className="p-3 border-b border-gray-800">{a._id}</td>
                      <td className="p-3 border-b border-gray-800 text-center">{a.avgRating?.toFixed(2)}</td>
                      <td className="p-3 border-b border-gray-800 text-center">{a.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="bg-gray-900/80 rounded-2xl shadow-xl p-6 border border-gray-800 overflow-x-auto">
            <table className="min-w-full bg-gray-900/80 rounded-2xl text-white shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 via-gray-900 to-slate-900 text-purple-200">
                  <th className="p-4 font-bold">Form Title</th>
                  <th className="p-4 font-bold">Student Name</th>
                  <th className="p-4 font-bold">Student Email</th>
                  <th className="p-4 font-bold">Question</th>
                  <th className="p-4 font-bold">Rating</th>
                  <th className="p-4 font-bold">Comment</th>
                </tr>
              </thead>
              <tbody>
                {responses.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-8 text-gray-400">No responses found.</td></tr>
                ) : (
                  responses.map(resp => (
                    resp.rating.map((q, idx) => (
                      <tr key={resp._id + idx} className="hover:bg-gray-800/60 transition">
                        <td className="p-4 border-b border-gray-800">{resp.formId?.title || resp.formId}</td>
                        <td className="p-4 border-b border-gray-800">{resp.studentId?.fullName || resp.studentId}</td>
                        <td className="p-4 border-b border-gray-800">{resp.studentId?.email || "-"}</td>
                        <td className="p-4 border-b border-gray-800">{q.questionText}</td>
                        <td className="p-4 border-b border-gray-800 text-center">{q.rating}</td>
                        <td className="p-4 border-b border-gray-800">{resp.comment || "-"}</td>
                      </tr>
                    ))
                  ))
                )}
              </tbody>
            </table>
            <div className="flex justify-between mt-8">
              <button
                className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold shadow disabled:opacity-50"
                onClick={() => {
                  setPage(p => {
                    const newPage = Math.max(1, p - 1);
                    if (newPage !== page) fetchResponses();
                    return newPage;
                  });
                }}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-white font-semibold">Page {page} of {totalPages}</span>
              <button
                className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold shadow disabled:opacity-50"
                onClick={() => {
                  setPage(p => {
                    const newPage = Math.min(totalPages, p + 1);
                    if (newPage !== page) fetchResponses();
                    return newPage;
                  });
                }}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeedbackResponses;
