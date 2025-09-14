import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const courses = ["BTech", "BBA", "BCA"];
const yearOptions = {
  default: ["First", "Second", "Third", "Fourth"],
  short: ["First", "Second", "Third"]
};
const semesterOptions = {
  default: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"],
  short: ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
};

function AdminFeedbackList() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/v1/feedbacks/${id}/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to mark as read");
    }
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/v1/feedbacks/${id}/reply`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplyingId(null);
      setReplyText("");
      fetchFeedbacks();
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (course) params.course = course;
      if (year) params.year = year;
      if (semester) params.semester = semester;
      const res = await axios.get("/api/v1/feedbacks/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setFeedbacks(res.data.data || []);
    } catch (err) {
      setError("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchFeedbacks();
    }
    // eslint-disable-next-line
  }, []);

  if (!user || user.role !== "admin") return <div className="p-4">Access denied.</div>;

  // Dynamic year/semester options
  const isShortCourse = course === "BBA" || course === "BCA";
  const years = isShortCourse ? yearOptions.short : yearOptions.default;
  const semesters = isShortCourse ? semesterOptions.short : semesterOptions.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-2 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-10 mt-8 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">Student Feedbacks</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-8 gap-4">
          <div className="flex flex-wrap gap-4">
            <select className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-2 px-4 text-white" value={course} onChange={e => { setCourse(e.target.value); setYear(""); setSemester(""); }}>
              <option value="">All Courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-2 px-4 text-white" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-2 px-4 text-white" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">All Semesters</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-xl shadow-md transition duration-200 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed" onClick={fetchFeedbacks} disabled={loading}>
            {loading ? "Loading..." : "Filter"}
          </button>
        </div>
        {error && <div className="text-red-400 font-semibold text-center sm:text-left mb-4">{error}</div>}
        <div className="overflow-x-auto w-full rounded-2xl shadow-lg">
          <table className="min-w-full bg-gray-900/80 rounded-2xl overflow-hidden text-white">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 via-gray-900 to-slate-900 text-purple-200">
                <th className="p-4 font-bold text-left">Student Name</th>
                <th className="p-4 font-bold text-left">Course</th>
                <th className="p-4 font-bold text-center">Year</th>
                <th className="p-4 font-bold text-center">Semester</th>
                <th className="p-4 font-bold text-left">Topic</th>
                <th className="p-4 font-bold text-left">Feedback</th>
                <th className="p-4 font-bold text-center">Date</th>
                <th className="p-4 font-bold text-center">Read</th>
                <th className="p-4 font-bold text-center">Reply</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr><td colSpan={10} className="text-center p-8 text-gray-500 font-semibold">No feedbacks found.</td></tr>
              ) : (
                feedbacks.map(fb => (
                  <tr key={fb._id} className="hover:bg-gray-800/60 transition">
                    <td className="p-4 border-b border-gray-800 font-semibold text-white">{fb.student?.fullName || fb.studentId}</td>
                    <td className="p-4 border-b border-gray-800 text-gray-300">{fb.course}</td>
                    <td className="p-4 border-b border-gray-800 text-center">{fb.year}</td>
                    <td className="p-4 border-b border-gray-800 text-center">{fb.semester}</td>
                    <td className="p-4 border-b border-gray-800 text-white">{fb.topic || '-'}</td>
                    <td className="p-4 border-b border-gray-800 text-gray-200">{fb.message}</td>
                    <td className="p-4 border-b border-gray-800 text-center">{new Date(fb.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 border-b border-gray-800 text-center">
                      {fb.isReadByAdmin ? (
                        <span className="text-green-400 font-semibold">Marked as Read</span>
                      ) : (
                        <span className="text-red-400 font-semibold">No</span>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-800 text-center">
                      {fb.adminReply ? (
                        <span className="text-green-400">{fb.adminReply}</span>
                      ) : (
                        replyingId === fb._id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-1 px-2 text-white"
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Type reply..."
                              disabled={fb.adminReply}
                            />
                            <div className="flex gap-1">
                              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-xl font-semibold transition" onClick={() => sendReply(fb._id)} disabled={fb.adminReply}>Send</button>
                              <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-xl font-semibold transition" onClick={() => { setReplyingId(null); setReplyText(""); }} disabled={fb.adminReply}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-1 rounded-xl font-semibold transition" onClick={() => { setReplyingId(fb._id); setReplyText(""); }} disabled={fb.adminReply}>Reply</button>
                        )
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-800 text-center">
                      {fb.isReadByAdmin ? null : (
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl font-semibold transition" onClick={() => markAsRead(fb._id)} disabled={fb.isReadByAdmin}>Mark as Read</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminFeedbackList;
