import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminCreateForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const defaultQuestion = { text: "", type: "rating", scale: 5 };
  const [questions, setQuestions] = useState([{ ...defaultQuestion }]);
  const [course, setCourse] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleQuestionChange = (idx, field, value) => {
    const updated = questions.map((q, i) =>
      i === idx
        ? { ...defaultQuestion, ...q, [field]: value }
        : { ...defaultQuestion, ...q }
    );
    setQuestions(updated);
  };

  const addQuestion = () =>
    setQuestions([...questions, { ...defaultQuestion }]);
  const removeQuestion = (idx) => {
    const filtered = questions
      .filter((_, i) => i !== idx)
      .map((q) => ({ ...defaultQuestion, ...q }));
    setQuestions(filtered.length ? filtered : [{ ...defaultQuestion }]);
  };

  const courseOptions = ["BTech", "BBA", "BCA"];
  const specializationOptions = {
    BTech: ["CSE", "ME", "CE"],
    BBA: ["IIFSB", "GEN", "DM"],
    BCA: ["GEN", "DS"]
  };
  const yearOptions =
    course === "BTech"
      ? ["First", "Second", "Third", "Fourth"]
      : course === "BBA" || course === "BCA"
        ? ["First", "Second", "Third"]
        : [];
  const semesterOptions =
    course === "BTech"
      ? [
          "First",
          "Second",
          "Third",
          "Fourth",
          "Fifth",
          "Sixth",
          "Seventh",
          "Eighth",
        ]
      : course === "BBA" || course === "BCA"
        ? ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
        : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const body = {
        title,
        description,
        teacherId: user._id,
        questions: questions
          .filter((q) => q.text && q.text.trim())
          .map((q) => ({ ...defaultQuestion, ...q })),
        course,
        specialization,
        year,
        semester,
        deadline,
        isActive,
      };
      await axios.post("/api/v1/forms/create-form", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Form created successfully!");
      setTitle("");
      setDescription("");
      setQuestions([{ questionText: "" }]);
      setCourse("");
      setSpecialization("");
      setSemester("");
      setYear("");
      setDeadline("");
      setIsActive(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "teacher"))
    return <div>Access denied.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-gray-900/80 rounded-2xl shadow-2xl p-8 relative border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow">Create Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            type="text"
            placeholder="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <label className="font-semibold text-purple-200 mb-2 block">Questions:</label>
            {questions.map((q, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  className="border border-gray-700 bg-gray-800 text-white p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  value={q.text ?? ""}
                  onChange={(e) => handleQuestionChange(idx, "text", e.target.value)}
                  required
                />
                <select
                  className="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg"
                  value={q.type ?? "rating"}
                  onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
                >
                  <option value="rating">Rating</option>
                </select>
                <input
                  className="border border-gray-700 bg-gray-800 text-white p-2 w-20 rounded-lg"
                  type="number"
                  min={2}
                  max={10}
                  value={q.scale ?? 5}
                  onChange={(e) => handleQuestionChange(idx, "scale", Number(e.target.value))}
                  required
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                    onClick={() => removeQuestion(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow transition"
              onClick={addQuestion}
            >
              Add Question
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-purple-200">Course:</label>
              <select
                className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-lg"
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setSpecialization("");
                  setYear("");
                  setSemester("");
                }}
                required
              >
                <option value="">Select Course</option>
                {courseOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {(course === "BBA" || course === "BCA" || course === "BTech") && (
              <div>
                <label className="font-semibold text-purple-200">Specialization:</label>
                <select
                  className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-lg"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializationOptions[course].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="font-semibold text-purple-200">Year:</label>
              <select
                className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-lg"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                disabled={!course}
              >
                <option value="">Select Year</option>
                {yearOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-purple-200">Semester:</label>
              <select
                className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-lg"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                disabled={!course}
              >
                <option value="">Select Semester</option>
                {semesterOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <input
            className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            type="date"
            placeholder="Deadline (optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              id="isActive"
              className="accent-blue-600 w-5 h-5"
            />
            <label htmlFor="isActive" className="text-purple-200">Active</label>
          </div>
          <button
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Form"}
          </button>
          {error && <div className="text-red-400 font-semibold text-center mt-2">{error}</div>}
          {success && <div className="text-green-400 font-semibold text-center mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default AdminCreateForm;
