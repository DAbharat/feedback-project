import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function FeedbackPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [universityRollNo, setUniversityRollNo] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // Fetch teachers on mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/feedbacks/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data.data || []);
      } catch (err) {
        // ignore
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Validate all fields
    if (!user.fullName || !user.course || !user.year || !user.semester || !rollNo || !universityRollNo || !topic || !message) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    // If teacher is selected, require subject
    if (teacherId && (!teacherName || !teacherSubject)) {
      setError("Please select both teacher and subject");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/v1/feedbacks/submitresponse",
        {
          topic,
          message,
          rollNo,
          universityRollNo,
          teacherId: teacherId || undefined,
          teacherName: teacherName || undefined,
          teacherSubject: teacherSubject || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Feedback sent successfully!");
      setTopic("");
      setMessage("");
      setRollNo("");
      setUniversityRollNo("");
      setTeacherId("");
      setTeacherName("");
      setTeacherSubject("");
      setTimeout(() => {
        navigate("/feedback/submitresponse");
      }, 1000);
        <div>
          <label className="block text-sm font-medium">Topic</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
            placeholder="Enter topic (e.g. Library, Hostel, Academics)"
          />
        </div>
    } catch (err) {
      setError("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-4">Please login to send feedback.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 border rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">Send Feedback to Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Student Name</label>
            <input className="border p-2 w-full bg-gray-100" value={user.fullName || ""} readOnly required />
          </div>
          <div>
            <label className="block text-sm font-medium">Roll No.</label>
            <input
              className="border p-2 w-full"
              type="text"
              value={rollNo}
              onChange={e => setRollNo(e.target.value)}
              required
              placeholder="Enter your roll number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">University Roll No.</label>
            <input
              className="border p-2 w-full"
              type="text"
              value={universityRollNo}
              onChange={e => setUniversityRollNo(e.target.value)}
              required
              placeholder="Enter your university roll number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Course</label>
            <input className="border p-2 w-full bg-gray-100" value={user.course || ""} readOnly required />
          </div>
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input className="border p-2 w-full bg-gray-100" value={user.year || ""} readOnly required />
          </div>
          <div>
            <label className="block text-sm font-medium">Semester</label>
            <input className="border p-2 w-full bg-gray-100" value={user.semester || ""} readOnly required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Topic</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            required
            placeholder="Enter topic (e.g. Library, Hostel, Academics)"
          />
        </div>
        {/* Teacher selection */}
        <div>
          <label className="block text-sm font-medium">Teacher (optional)</label>
          <select
            className="border p-2 w-full"
            value={teacherId}
            onChange={e => {
              const id = e.target.value;
              setTeacherId(id);
              const teacher = teachers.find(t => t._id === id);
              setTeacherName(teacher ? teacher.fullName : "");
              setTeacherSubject(""); // reset subject
            }}
          >
            <option value="">-- Select Teacher (or leave blank for general feedback) --</option>
            {teachers.map(t => (
              <option key={t._id} value={t._id}>{t.fullName}</option>
            ))}
          </select>
        </div>
        {/* Subject selection, only if teacher is selected */}
        {teacherId && (
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <select
              className="border p-2 w-full"
              value={teacherSubject}
              onChange={e => setTeacherSubject(e.target.value)}
              required
            >
              <option value="">-- Select Subject --</option>
              {(teachers.find(t => t._id === teacherId)?.subjects || []).map((subj, idx) => (
                <option key={idx} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">Feedback</label>
          <textarea
            className="border p-2 w-full min-h-[100px]"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            placeholder="Write your feedback here..."
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Feedback"}
        </button>
      </form>
    </div>
  );
}

export default FeedbackPage;