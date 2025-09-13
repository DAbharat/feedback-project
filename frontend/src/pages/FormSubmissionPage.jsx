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

  if (!user || user.role !== "student") return <div>Access denied.</div>;
  if (loading && !form) return <div>Loading form...</div>;
  if (error && !form) return <div className="text-red-500">{error}</div>;
  if (!form) return null;
  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 border rounded text-center">
        <h2 className="text-xl font-bold mb-4 text-green-700">Form Submitted!</h2>
        <p className="mb-4">Thank you for your feedback.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">{form.title}</h2>
      <p className="mb-4">{form.description}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.questions.map((q, idx) => (
          <div key={idx} className="mb-2">
            <label className="block font-semibold mb-1">{q.text}</label>
            <input
              type="number"
              min={1}
              max={q.scale || 5}
              value={responses[idx]?.rating || ""}
              onChange={e => handleRatingChange(idx, Number(e.target.value))}
              className="border p-2 w-24"
              required
            />
            <span className="ml-2 text-gray-500">/ {q.scale || 5}</span>
          </div>
        ))}
        <textarea
          className="border p-2 w-full"
          placeholder="Additional comments (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
    </div>
  );
}

export default FormSubmissionPage;
