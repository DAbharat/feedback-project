import { useNavigate } from "react-router-dom";

function FeedbackSubmittedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black relative px-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-24 left-24 w-[500px] h-[500px] bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      {/* Cyber grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center py-24">
        <h2 className="text-5xl font-black mb-8 text-center bg-gradient-to-r from-green-300 via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">Feedback Submitted!</h2>
        <p className="mb-10 text-xl text-gray-200 text-center max-w-2xl">Thank you for your feedback.<br/>The admin will review it soon.</p>
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-purple-400/40 transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default FeedbackSubmittedPage;
