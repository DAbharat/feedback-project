import { useNavigate } from "react-router-dom";

function FeedbackSubmittedPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto mt-20 p-8 border rounded bg-white text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Feedback Submitted!</h2>
      <p className="mb-6">Thank you for your feedback. The admin will review it soon.</p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
}

export default FeedbackSubmittedPage;
