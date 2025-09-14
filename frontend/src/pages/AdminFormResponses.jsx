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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl bg-gray-900/80 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">Form Responses</h2>
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select value={selectedForm} onChange={e => setSelectedForm(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Select Form</option>
            {forms.map(f => (
              <option key={f._id} value={f._id}>{f.title}</option>
            ))}
          </select>
          <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course" className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          <input value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          <input value={semester} onChange={e => setSemester(e.target.value)} placeholder="Semester" className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          <button onClick={fetchResponses} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow transition">Filter</button>
        </div>
        {error && <div className="text-red-400 font-semibold text-center mb-4">{error}</div>}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full bg-gray-900/80 rounded-2xl text-white shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 via-gray-900 to-slate-900 text-purple-200">
                  <th className="p-4 font-bold">Student</th>
                  <th className="p-4 font-bold">Form</th>
                  <th className="p-4 font-bold">Rating</th>
                  <th className="p-4 font-bold">Comment</th>
                  <th className="p-4 font-bold">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {responses.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-8 text-gray-400">No responses found.</td></tr>
                ) : responses.map(r => (
                  <tr key={r._id} className="hover:bg-gray-800/60 transition">
                    <td className="p-4 border-b border-gray-800">{r.studentId?.fullName || r.studentId?.username || r.studentId}</td>
                    <td className="p-4 border-b border-gray-800">{r.formId?.title || r.formId}</td>
                    <td className="p-4 border-b border-gray-800 text-center">{r.rating}</td>
                    <td className="p-4 border-b border-gray-800">{r.comment}</td>
                    <td className="p-4 border-b border-gray-800 text-center">{new Date(r.createdAt).toLocaleString()}</td>
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
