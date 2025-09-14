import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminFormResponses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  // Fetch forms only once on mount (or when user changes)
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/forms/forms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForms(res.data.data || []);
      } catch (err) {
        setError("Failed to load forms");
      }
    };
    if (user && user.role === "admin") fetchForms();
  }, [user]);

  const fetchResponses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (selectedForm) params.formId = selectedForm;
      if (course) params.course = course;
      if (year) params.year = year;
      if (semester) params.semester = semester;
      const res = await axios.get("/api/v1/form-responses/responses", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setResponses(res.data.data || []);
    } catch (err) {
      setError("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-8">
      <div className="max-w-5xl mx-auto bg-gray-900/80 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-white">Form Responses</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={selectedForm} onChange={e => setSelectedForm(e.target.value)} className="px-4 py-2 rounded bg-gray-800 text-white">
            <option value="">Select Form</option>
            {forms.map(f => (
              <option key={f._id} value={f._id}>{f.title}</option>
            ))}
          </select>
          <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course" className="px-4 py-2 rounded bg-gray-800 text-white" />
          <input value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="px-4 py-2 rounded bg-gray-800 text-white" />
          <input value={semester} onChange={e => setSemester(e.target.value)} placeholder="Semester" className="px-4 py-2 rounded bg-gray-800 text-white" />
          <button onClick={fetchResponses} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded font-bold">Filter</button>
        </div>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900/80 rounded-2xl text-white">
              <thead>
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Form</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {responses.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-8 text-gray-400">No responses found.</td></tr>
                ) : responses.map(r => (
                  <tr key={r._id}>
                    <td className="p-4">{r.studentId?.fullName || r.studentId?.username || r.studentId}</td>
                    <td className="p-4">{r.formId?.title || r.formId}</td>
                    <td className="p-4">{r.rating}</td>
                    <td className="p-4">{r.comment}</td>
                    <td className="p-4">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFormResponses;
