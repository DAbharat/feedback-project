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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-white text-center max-w-md">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">Only students can submit forms</p>
        </div>
      </div>
    );

  if (loading && !form)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-white text-center">
          <svg className="animate-spin w-12 h-12 mx-auto mb-4 text-purple-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Loading form...</p>
        </div>
      </div>
    );

  if (error && !form)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-red-700/50 rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );

  if (!form) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-12 shadow-2xl text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            Form Submitted!
          </h2>
          <p className="mb-8 text-xl text-gray-300">Thank you for your valuable feedback.</p>
          <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
            onClick={() => navigate("/forms")}
          >
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-4 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg mb-3">
            {form.title}
          </h1>
          <p className="text-gray-300 text-lg">{form.description}</p>
          {form.deadline && (
            <p className="text-gray-400 text-sm mt-2">
              Deadline: {new Date(form.deadline).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Questions */}
            <div className="space-y-6">
              {form.questions.map((q, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-gray-800/30 border border-gray-700/30 rounded-xl p-5">
                  <label className="block font-semibold mb-3 text-white text-lg">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold mr-3">
                      {idx + 1}
                    </span>
                    {q.text}
                  </label>
                  <div className="flex items-center gap-4 ml-11">
                    <input
                      type="number"
                      min={1}
                      max={q.scale || 5}
                      value={responses[idx]?.rating || ""}
                      onChange={e => handleRatingChange(idx, Number(e.target.value))}
                      className="bg-gray-800/80 border border-gray-700/50 rounded-xl py-3 px-4 text-white w-28 text-center text-lg font-semibold focus:border-purple-500/50 focus:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                      required
                    />
                    <span className="text-gray-400 text-lg font-medium">/ {q.scale || 5}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Section */}
            <div className="backdrop-blur-sm bg-gray-800/30 border border-gray-700/30 rounded-xl p-5">
              <label className="block font-semibold mb-3 text-white text-lg">
                Additional Comments (Optional)
              </label>
              <textarea
                className="bg-gray-800/80 border border-gray-700/50 rounded-xl py-3 px-4 text-white w-full placeholder-gray-400 focus:border-purple-500/50 focus:bg-gray-700/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 min-h-[120px] resize-none"
                placeholder="Share any additional thoughts or suggestions..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="backdrop-blur-lg bg-red-900/20 border border-red-700/50 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="backdrop-blur-lg bg-green-900/20 border border-green-700/50 rounded-xl p-4">
                <p className="text-green-400 font-semibold text-center">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none relative overflow-hidden group"
              type="submit"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Submit Feedback</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormSubmissionPage;