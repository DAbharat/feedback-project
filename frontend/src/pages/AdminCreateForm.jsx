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
    <div className="max-w-2xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Create Feedback Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="font-semibold">Questions:</label>
          {questions.map((q, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                className="border p-2 flex-1"
                type="text"
                placeholder={`Question ${idx + 1}`}
                value={q.text ?? ""}
                onChange={(e) =>
                  handleQuestionChange(idx, "text", e.target.value)
                }
                required
              />
              <select
                className="border p-2"
                value={q.type ?? "rating"}
                onChange={(e) =>
                  handleQuestionChange(idx, "type", e.target.value)
                }
              >
                <option value="rating">Rating</option>
              </select>
              <input
                className="border p-2 w-20"
                type="number"
                min={2}
                max={10}
                value={q.scale ?? 5}
                onChange={(e) =>
                  handleQuestionChange(idx, "scale", Number(e.target.value))
                }
                required
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => removeQuestion(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>
        <div>
          <label className="font-semibold">Course:</label>
          <select
            className="border p-2 w-full"
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
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        {(course === "BBA" || course === "BCA" || course === "BTech") && (
          <div>
            <label className="font-semibold">Specialization:</label>
            <select
              className="border p-2 w-full"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            >
              <option value="">Select Specialization</option>
              {specializationOptions[course].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="font-semibold">Year:</label>
          <select
            className="border p-2 w-full"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            disabled={!course}
          >
            <option value="">Select Year</option>
            {yearOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Semester:</label>
          <select
            className="border p-2 w-full"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
            disabled={!course}
          >
            <option value="">Select Semester</option>
            {semesterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <input
          className="border p-2 w-full"
          type="date"
          placeholder="Deadline (optional)"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="isActive"
          />
          <label htmlFor="isActive">Active</label>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Form"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
    </div>
  );
}

export default AdminCreateForm;
