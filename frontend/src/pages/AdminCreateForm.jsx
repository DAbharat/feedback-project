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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center pt-24">
        <div className="text-white text-xl">Access denied.</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 px-4 pt-16">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {/* Cyber grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Create Feedback Form
            </h2>
            <p className="text-gray-400">Design a new feedback form for your students</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400 font-semibold">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-400 font-semibold">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-200 border-b border-gray-700 pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Form Title *</label>
                <input
                  className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  type="text"
                  placeholder="Enter form title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description (Optional)</label>
                <textarea
                  className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 min-h-[100px] resize-none"
                  placeholder="Enter form description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-purple-200">Questions</h3>
                <button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  onClick={addQuestion}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-purple-300">Question {idx + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1"
                          onClick={() => removeQuestion(idx)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                        type="text"
                        placeholder={`Enter question text`}
                        value={q.text ?? ""}
                        onChange={(e) => handleQuestionChange(idx, "text", e.target.value)}
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1">Question Type</label>
                          <select
                            className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                            value={q.type ?? "rating"}
                            onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
                          >
                            <option value="rating">Rating</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1">Rating Scale (2-10)</label>
                          <input
                            className="border border-gray-700 bg-gray-800 text-white p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                            type="number"
                            min={2}
                            max={10}
                            value={q.scale ?? 5}
                            onChange={(e) => handleQuestionChange(idx, "scale", Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-200 border-b border-gray-700 pb-2">Target Audience</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Course *</label>
                  <select
                    className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
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
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Specialization *</label>
                    <select
                      className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Year *</label>
                  <select
                    className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Semester *</label>
                  <select
                    className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>

            {/* Form Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-200 border-b border-gray-700 pb-2">Form Settings</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Deadline (Optional)</label>
                <input
                  className="border border-gray-700 bg-gray-800 text-white p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  id="isActive"
                  className="accent-blue-600 w-5 h-5 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-purple-200 font-semibold cursor-pointer flex-1">
                  Make form active immediately
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed text-lg relative overflow-hidden group"
              type="submit"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Form...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Create Form</span>
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

export default AdminCreateForm;