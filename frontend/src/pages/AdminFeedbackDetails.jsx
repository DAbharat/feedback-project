import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminFeedbackDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      return;
    }
    const fetchOne = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/feedbacks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedback(res.data.data || res.data); // adapt to API shape
        // auto mark as read if not already
        if (res.data.data && !res.data.data.isReadByAdmin) {
          await axios.post(`/api/v1/feedbacks/${id}/mark-read`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // update local state
          setFeedback(prev => prev ? { ...prev, isReadByAdmin: true } : prev);
        }
      } catch (err) {
        setError("Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
    // eslint-disable-next-line
  }, [id, user]);

  const handleMarkRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/v1/feedbacks/${id}/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(prev => prev ? { ...prev, isReadByAdmin: true } : prev);
    } catch (err) {
      alert("Failed to mark as read");
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/v1/feedbacks/${id}/reply`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(prev => prev ? { ...prev, adminReply: replyText } : prev);
      setReplying(false);
      setReplyText("");
    } catch (err) {
      alert("Failed to send reply");
    }
  };

  if (!user || user.role !== "admin") return <div className="p-4">Access denied.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 px-4">
      <div className="max-w-3xl mx-auto relative z-10">
        <button className="mb-6 text-sm text-gray-300 hover:text-white" onClick={() => navigate(-1)}>← Back</button>
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : !feedback ? (
            <div className="text-gray-400">No feedback found.</div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold mb-4 text-white">{feedback.topic || "General Feedback"}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-400">Student Name</label>
                  <div className="text-white font-semibold">{feedback.student?.fullName || feedback.studentId}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Course</label>
                  <div className="text-white font-semibold">{feedback.course || "-"}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Year</label>
                  <div className="text-white font-semibold">{feedback.year || "-"}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Semester</label>
                  <div className="text-white font-semibold">{feedback.semester || "-"}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-400">Feedback</label>
                <div className="mt-2 bg-gray-800/60 border border-gray-700 rounded-2xl p-6 text-gray-100 text-lg leading-relaxed min-h-[140px]">
                  {feedback.message}
                </div>
              </div>

              {feedback.adminReply && (
                <div className="mb-4">
                  <label className="text-sm text-gray-400">Admin Reply</label>
                  <div className="mt-2 bg-green-900/20 border border-green-700 rounded-xl p-4 text-green-200">{feedback.adminReply}</div>
                </div>
              )}

              <div className="flex gap-3 items-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold" onClick={() => { setReplying(prev => !prev); setTimeout(() => replyRef.current?.focus(), 50); }}>
                  Reply
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold" onClick={handleMarkRead} disabled={feedback.isReadByAdmin}>
                  {feedback.isReadByAdmin ? "Marked as Read" : "Mark as Read"}
                </button>
              </div>

              {replying && !feedback.adminReply && (
                <div className="mt-4">
                  <textarea
                    ref={replyRef}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-white min-h-[80px]"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl" onClick={handleSendReply}>Send Reply</button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl" onClick={() => { setReplying(false); setReplyText(""); }}>Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeedbackDetails;