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
  }, [course, year, semester]);

  if (!user || user.role !== "admin") return <div className="p-4">Access denied.</div>;

  // Dynamic year/semester options
  const isShortCourse = course === "BBA" || course === "BCA";
  const years = isShortCourse ? yearOptions.short : yearOptions.default;
  const semesters = isShortCourse ? semesterOptions.short : semesterOptions.default;

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Student Feedbacks</h2>
      <div className="flex gap-4 mb-4">
        <select className="border p-2" value={course} onChange={e => { setCourse(e.target.value); setYear(""); setSemester(""); }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border p-2" value={year} onChange={e => setYear(e.target.value)}>
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="border p-2" value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">All Semesters</option>
          {semesters.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchFeedbacks} disabled={loading}>
          {loading ? "Loading..." : "Filter"}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Semester</th>
              <th className="p-2 border">Topic</th>
              <th className="p-2 border">Feedback</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr><td colSpan={7} className="text-center p-4">No feedbacks found.</td></tr>
            ) : (
              feedbacks.map(fb => (
                <tr key={fb._id}>
                  <td className="p-2 border">{fb.student?.fullName || fb.studentId}</td>
                  <td className="p-2 border">{fb.course}</td>
                  <td className="p-2 border">{fb.year}</td>
                  <td className="p-2 border">{fb.semester}</td>
                  <td className="p-2 border">{fb.topic || '-'}</td>
                  <td className="p-2 border">{fb.message}</td>
                  <td className="p-2 border">{new Date(fb.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFeedbackList;
