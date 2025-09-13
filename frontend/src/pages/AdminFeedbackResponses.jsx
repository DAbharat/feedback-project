
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

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "teacher")) {
      fetchResponses();
    }
    // eslint-disable-next-line
  }, [formId, studentId, page]);

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
    <div className="max-w-5xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Feedback Responses</h2>
      <div className="flex gap-4 mb-4 items-center">
        <select
          className="border p-2 min-w-[200px]"
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
        <input
          className="border p-2"
          type="text"
          placeholder="Filter by Student ID"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchResponses} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleExport}>
          Export CSV
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Analytics Section */}
      {analytics.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Analytics (Average Rating per Question)</h3>
          <table className="min-w-full border mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Average Rating</th>
                <th className="p-2 border">Responses</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((a, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{a._id}</td>
                  <td className="p-2 border">{a.avgRating?.toFixed(2)}</td>
                  <td className="p-2 border">{a.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Form Title</th>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Student Email</th>
              <th className="p-2 border">Question</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Comment</th>
            </tr>
          </thead>
          <tbody>
            {responses.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">No responses found.</td></tr>
            ) : (
              responses.map(resp => (
                resp.rating.map((q, idx) => (
                  <tr key={resp._id + idx}>
                    <td className="p-2 border">{resp.formId?.title || resp.formId}</td>
                    <td className="p-2 border">{resp.studentId?.fullName || resp.studentId}</td>
                    <td className="p-2 border">{resp.studentId?.email || "-"}</td>
                    <td className="p-2 border">{q.questionText}</td>
                    <td className="p-2 border">{q.rating}</td>
                    <td className="p-2 border">{resp.comment || "-"}</td>
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminFeedbackResponses;
