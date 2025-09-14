import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    section: "",
    course: "",
    specialization: "",
    year: "",
    semester: "",
  });
  const [idCard, setIdCard] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const courseOptions = ["BTech", "BBA", "BCA"];
  const specializationOptions = {
    BTech: ["CSE", "ME", "CE"],
    BBA: ["IIFSB", "GEN", "DM"],
    BCA: ["GEN", "DS"]
  };
  const yearOptions = form.course === "BTech"
    ? ["First", "Second", "Third", "Fourth"]
    : (form.course === "BBA" || form.course === "BCA")
      ? ["First", "Second", "Third"]
      : [];
  const semesterOptions = form.course === "BTech"
    ? ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"]
    : (form.course === "BBA" || form.course === "BCA")
      ? ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
      : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "course") {
      setForm(f => ({ ...f, course: value, specialization: "", year: "", semester: "" }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.name === "idCard") setIdCard(e.target.files[0]);
    if (e.target.name === "profileImage") setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (idCard) formData.append("idCard", idCard);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please check your details and try again.");
      console.log("Registration failed:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {/* Register Card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="backdrop-blur-lg bg-gray-900/80 border border-gray-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50 relative">
          {/* Floating decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg animate-pulse animation-delay-2000"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
              </svg>
            </div>
            <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-400">Sign up to access the feedback portal</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <input 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange} 
                  placeholder="Enter username" 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                <input 
                  name="fullName" 
                  value={form.fullName} 
                  onChange={handleChange} 
                  placeholder="Enter full name" 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Enter email address" 
                  type="email" 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <input 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="Enter password" 
                  type="password" 
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  required 
                />
              </div>
            </div>

            {/* Role Assignment Information */}
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <div className="text-blue-200 text-sm">
                  <span className="font-semibold">Role Assignment:</span> Your role (student/teacher) is automatically assigned based on your ID card using OCR technology. Please upload a clear image of your ID card. Admin roles can only be assigned by the project owner.
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Academic Information
                <span className="text-sm font-normal text-gray-400 ml-2">(Required for students)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Section</label>
                  <select 
                    name="section" 
                    value={form.section} 
                    onChange={handleChange} 
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Course</label>
                  <select
                    name="course"
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                    value={form.course}
                    onChange={handleChange}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(form.course === "BBA" || form.course === "BCA" || form.course === "BTech") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Specialization</label>
                  <select
                    name="specialization"
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                    value={form.specialization}
                    onChange={handleChange}
                  >
                    <option value="">Select Specialization</option>
                    {specializationOptions[form.course].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
                  <select
                    name="year"
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.year}
                    onChange={handleChange}
                    disabled={!form.course}
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Semester</label>
                  <select
                    name="semester"
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={form.semester}
                    onChange={handleChange}
                    disabled={!form.course}
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">File Uploads</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  ID Card <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input 
                    name="idCard" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    required 
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Upload a clear image of your college ID card for role verification</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Profile Image <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <input 
                    name="profileImage" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200" 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Upload a profile picture (optional)</p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-400/40 disabled:shadow-gray-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group" 
              type="submit" 
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
                    </svg>
                    <span>Create Account</span>
                  </>
                )}
              </div>
            </button>
          </form>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Your information is kept secure and private
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Already have an account? <a href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;