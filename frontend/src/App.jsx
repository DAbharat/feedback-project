import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import FormPage from "./pages/FormPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminUserTable from "./pages/AdminUserTable.jsx";
import AdminFormsList from "./pages/AdminFormsList.jsx";
import AdminCreateForm from "./pages/AdminCreateForm.jsx";
import AdminFeedbackResponses from "./pages/AdminFeedbackResponses.jsx";
import FormSubmissionPage from "./pages/FormSubmissionPage.jsx";
import Navbar from "./components/common/Navbar.jsx";





function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/forms" element={<FormPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users" element={<AdminUserTable />} />
          <Route path="/admin/forms" element={<AdminFormsList />} />
          <Route path="/admin/forms/create-form" element={<AdminCreateForm />} />
          <Route path="/admin/forms/:id/responses" element={<AdminFeedbackResponses />} />
          <Route path="/admin/form-responses" element={<AdminFeedbackResponses />} />
          <Route path="/admin/form-responses/responses/all" element={<AdminFeedbackResponses />} />
          <Route path="/form/:id" element={<FormSubmissionPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;