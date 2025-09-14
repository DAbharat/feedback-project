import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function FormSubmissionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/forms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data.data);
        setResponses(
          res.data.data.questions.map(q => ({ questionText: q.text, rating: 0 }))
        );
      } catch (err) {
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
    // eslint-disable-next-line
  }, [id]);

  const handleRatingChange = (idx, value) => {
    const updated = [...responses];
    updated[idx].rating = value;
    setResponses(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/v1/form-responses/submitresponse",
        {
          formId: id,
          studentId: user._id,
          rating: responses,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Feedback submitted successfully!");
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit feedback or already submitted."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "student")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-white text-center">
          Access denied.
        </div>
      </div>
    );
  if (loading && !form)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-white text-center">
          Loading form...
        </div>
      </div>
    );
  if (error && !form)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-red-400 text-center">
          {error}
        </div>
      </div>
    );
  if (!form) return null;
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-400 text-center drop-shadow-lg">Form Submitted!</h2>
        <p className="mb-8 text-xl text-gray-200 text-center">Thank you for your feedback.</p>
        <button
          className="mx-auto block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-3 rounded-2xl shadow-lg transition duration-200"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-2 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50 w-full">
          <h2 className="text-2xl font-extrabold mb-2 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">{form.title}</h2>
          <p className="mb-6 text-center text-gray-300">{form.description}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.questions.map((q, idx) => (
              <div key={idx} className="mb-2">
                <label className="block font-semibold mb-2 text-white">{q.text}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={q.scale || 5}
                    value={responses[idx]?.rating || ""}
                    onChange={e => handleRatingChange(idx, Number(e.target.value))}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-2 px-4 text-white w-24 focus:border-purple-500/50 focus:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                    required
                  />
                  <span className="text-gray-400">/ {q.scale || 5}</span>
                </div>
              </div>
            ))}
            <textarea
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-3 px-4 text-white w-full placeholder-gray-400 focus:border-purple-500/50 focus:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
              placeholder="Additional comments (optional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-400/40 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
              type="submit"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Feedback</span>
                )}
              </div>
            </button>
            {error && <div className="text-red-400 text-center font-semibold">{error}</div>}
            {success && <div className="text-green-400 text-center font-semibold">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormSubmissionPage;
