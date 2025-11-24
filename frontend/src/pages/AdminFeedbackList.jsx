import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  const isShortCourse = course === "BBA" || course === "BCA";
  const years = isShortCourse ? yearOptions.short : yearOptions.default;
  const semesters = isShortCourse ? semesterOptions.short : semesterOptions.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-4 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg mb-2">
            Student Feedbacks
          </h1>
        </div>

        {/* Filters Card */}
        <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-3 flex-1">
              <select
                className="bg-gray-800/80 border border-gray-700/50 rounded-xl py-2.5 px-4 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition min-w-[140px]"
                value={course}
                onChange={e => { setCourse(e.target.value); setYear(""); setSemester(""); }}
              >
                <option value="">All Courses</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="bg-gray-800/80 border border-gray-700/50 rounded-xl py-2.5 px-4 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition min-w-[140px]"
                value={year}
                onChange={e => setYear(e.target.value)}
              >
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                className="bg-gray-800/80 border border-gray-700/50 rounded-xl py-2.5 px-4 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition min-w-[140px]"
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg hover:shadow-purple-500/25 transition duration-200 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
              onClick={fetchFeedbacks}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-lg bg-red-900/20 border border-red-700/50 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Table Card */}
        <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800/50">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-slate-900/90">
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-200 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-200 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Sem</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-200 uppercase tracking-wider">Topic</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-200 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Reply</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 font-semibold">No feedbacks found</p>
                        <p className="text-gray-600 text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feedbacks.map(fb => (
                    <tr
                      key={fb._id}
                      className="hover:bg-gray-800/40 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/admin/feedbacks/${fb._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                            {(fb.student?.fullName || "U")[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-white text-sm">{fb.student?.fullName || fb.studentId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm font-medium">{fb.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400 text-sm">{fb.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400 text-sm">{fb.semester}</td>
                      <td className="px-6 py-4 text-white text-sm font-medium max-w-[150px] truncate">{fb.topic || '-'}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm max-w-[200px] truncate">{fb.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400 text-xs">{new Date(fb.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {fb.isReadByAdmin ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-400 border border-green-700/30">
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-400 border border-red-700/30">
                            Unread
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                        {fb.adminReply ? (
                          <span className="text-green-400 text-sm italic max-w-[150px] truncate inline-block">"{fb.adminReply}"</span>
                        ) : replyingId === fb._id ? (
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <input
                              type="text"
                              className="bg-gray-800/80 border border-gray-700/50 rounded-lg py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                onClick={() => sendReply(fb._id)}
                              >
                                Send
                              </button>
                              <button
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                                onClick={() => { setReplyingId(null); setReplyText(""); }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-md hover:shadow-purple-500/25"
                            onClick={() => { setReplyingId(fb._id); setReplyText(""); }}
                          >
                            Reply
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                        {!fb.isReadByAdmin && (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition shadow-md hover:shadow-yellow-500/25"
                            onClick={() => markAsRead(fb._id)}
                          >
                            Mark Read
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
      </div>
    </div>
  );
}

export default AdminFeedbackList;