import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import FormPage from "./pages/FormPage.jsx";
import SubmissionPage from "./pages/SubmissionPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import Navbar from "./components/common/Navbar.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/submission" element={<SubmissionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;