import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedForms, setSubmittedForms] = useState([]);

  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const formsRes = await axios.get("/api/v1/forms/forms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let submitted = [];
      if (user && user.role === "student") {
        const submittedRes = await axios.get("/api/v1/form-responses/submitted-forms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = submittedRes?.data?.data || [];
        submitted = raw.map((item) => {
          return item.form?._id || item.formId || item.form || item._id || item;
        });
      }

      setForms(formsRes?.data?.data || []);
      setSubmittedForms(Array.isArray(submitted) ? submitted : []);
    } catch (err) {
      console.error("fetchForms error:", err);
      setError("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.role]);

  useEffect(() => {
    if (user === null) navigate("/register");
  }, [user, navigate]);

  if (!user) return null;

  const visibleForms = user.role === "student"
    ? forms.filter(f => f.isActive)
    : forms;

  const sortedForms = [...visibleForms].sort((a, b) => {
    const aFilled = submittedForms.includes(a._id);
    const bFilled = submittedForms.includes(b._id);
    const aExpired = a.deadline && new Date(a.deadline) < new Date();
    const bExpired = b.deadline && new Date(b.deadline) < new Date();
    
    // Sort unfilled & unexpired first, then filled/expired
    if (aFilled !== bFilled) return aFilled ? 1 : -1;
    if (aExpired !== bExpired) return aExpired ? 1 : -1;
    
    const aDate = a.deadline ? new Date(a.deadline) : new Date(0);
    const bDate = b.deadline ? new Date(b.deadline) : new Date(0);
    return bDate - aDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden px-4 py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg mb-2">
              Feedback Forms
            </h1>
          </div>
          <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg hover:shadow-purple-500/25 transition duration-200 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
            onClick={fetchForms}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Forms"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-lg bg-red-900/20 border border-red-700/50 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Table Card */}
        <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800/50">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-slate-900/90">
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-200 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-200 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-purple-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {sortedForms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 font-semibold">No forms available</p>
                        <p className="text-gray-600 text-sm">Check back later for new forms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedForms.map(form => {
                    const alreadySubmitted = submittedForms.includes(form._id);
                    const isPastDeadline = form.deadline && new Date(form.deadline) < new Date();
                    const isDisabled = alreadySubmitted || isPastDeadline;
                    
                    return (
                      <tr
                        key={form._id}
                        className="hover:bg-gray-800/40 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-white text-sm">{form.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm max-w-[250px] truncate">{form.description || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-900/30 text-blue-400 border border-blue-700/30">
                            {form.questions?.length || 0} Q's
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {alreadySubmitted ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-400 border border-green-700/30">
                              ✓ Submitted
                            </span>
                          ) : isPastDeadline ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-400 border border-red-700/30">
                              ⏰ Expired
                            </span>
                          ) : form.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-900/30 text-purple-400 border border-purple-700/30">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800/50 text-gray-400 border border-gray-700/30">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400 text-xs">
                          {form.deadline ? (
                            <div className="flex flex-col items-center">
                              <span>{new Date(form.deadline).toLocaleDateString()}</span>
                              {isPastDeadline && !alreadySubmitted && (
                                <span className="text-red-400 text-xs mt-1">Deadline passed</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">No deadline</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.role === "student" && form.isActive && (
                            <button
                              className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-md ${
                                isDisabled
                                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-purple-500/25'
                              }`}
                              onClick={() => !isDisabled && navigate(`/form/${form._id}`)}
                              disabled={isDisabled}
                              title={alreadySubmitted ? 'You have already submitted this form' : isPastDeadline ? 'Deadline has passed' : 'Click to fill the form'}
                            >
                              {alreadySubmitted ? 'Completed ✓' : isPastDeadline ? 'Expired ⏰' : 'Fill Form'}
                            </button>
                          )}
                          {user.role === "admin" && (
                            <button
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-purple-500/25"
                              onClick={() => navigate(`/admin/forms/${form._id}`)}
                            >
                              Manage
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;