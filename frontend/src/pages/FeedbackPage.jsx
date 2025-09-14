import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function FeedbackPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) navigate("/register");
  }, [user, navigate]);
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [universityRollNo, setUniversityRollNo] = useState("");
  const universityRollNoPrefixes = [
    "2102", "2202", "2302", "2402", "2502"
  ];
  const [universityRollNoPrefix, setUniversityRollNoPrefix] = useState("2302");
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
    // University Roll No validation
    if (!universityRollNo.match(/^\d{7}$/)) {
      setError("University Roll No. must be 11 digits, starting with the selected prefix, and you must enter the next 7 digits.");
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
          universityRollNo: universityRollNoPrefix + universityRollNo,
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
    } catch (err) {
      setError("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-4 pt-24">Please login to send feedback.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 px-4 pt-12">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Cyber grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50 relative">
          {/* Floating decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg animate-pulse animation-delay-2000"></div>
          
          <h2 className="text-3xl font-black mb-8 text-center bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Send Feedback
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student name, roll no, univ roll no in one row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Student Name</label>
                <input 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  value={user.fullName || ""} 
                  readOnly 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Roll No.</label>
                <input
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                  type="text"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  required
                  placeholder="Enter your roll number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">University Roll No.</label>
                <div className="flex">
                  <select
                    className="bg-gray-800/50 border border-gray-600/50 text-white rounded-l-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                    value={universityRollNoPrefix}
                    onChange={e => setUniversityRollNoPrefix(e.target.value)}
                  >
                    {universityRollNoPrefixes.map(prefix => (
                      <option key={prefix} value={prefix}>{prefix}</option>
                    ))}
                  </select>
                  <input
                    className="flex-1 bg-gray-800/50 border border-l-0 border-gray-600/50 rounded-r-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                    type="text"
                    value={universityRollNo}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 7);
                      setUniversityRollNo(val);
                    }}
                    required
                    placeholder="Next 7 digits"
                    maxLength={7}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Full University Roll No.: <span className="font-mono text-purple-300">{universityRollNoPrefix}{universityRollNo}</span>
                </p>
              </div>
            </div>
            
            {/* Course, year, semester in one row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Course</label>
                <input 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  value={user.course || ""} 
                  readOnly 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
                <input 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  value={user.year || ""} 
                  readOnly 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Semester</label>
                <input 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  value={user.semester || ""} 
                  readOnly 
                  required 
                />
              </div>
            </div>
            
            {/* Teacher selection row: dropdown (with Other) and subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Teacher Name (Optional)</label>
                {teacherId === "other" ? (
                  <input
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                    type="text"
                    value={teacherName}
                    onChange={e => setTeacherName(e.target.value)}
                    placeholder="Type teacher name"
                    onBlur={() => { if (!teacherName) setTeacherId(""); }}
                  />
                ) : (
                  <select
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                    value={teacherId}
                    onChange={e => {
                      const id = e.target.value;
                      setTeacherId(id);
                      if (id === "other") {
                        setTeacherName("");
                      } else {
                        const teacher = teachers.find(t => t._id === id);
                        setTeacherName(teacher ? teacher.fullName : "");
                      }
                      setTeacherSubject("");
                    }}
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>{t.fullName}</option>
                    ))}
                    <option value="other">Other (Type Name)</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Subject</label>
                <input
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="text"
                  value={teacherSubject}
                  onChange={e => setTeacherSubject(e.target.value)}
                  required={!!teacherId || !!teacherName}
                  disabled={!(teacherId || teacherName)}
                  placeholder="Enter subject"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Topic</label>
              <input
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                required
                placeholder="Enter topic (e.g. Library, Hostel, Academics)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Feedback</label>
              <textarea
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                placeholder="Write your feedback here..."
              />
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="text-red-400 text-sm font-semibold">{error}</div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="text-green-400 text-sm font-semibold">{success}</div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-purple-400/40 disabled:shadow-gray-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Feedback</span>
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

export default FeedbackPage;