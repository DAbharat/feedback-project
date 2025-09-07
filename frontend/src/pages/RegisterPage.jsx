import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "student", // default to student
    section: "",
    course: "",
    semester: "",
  });
  const [idCard, setIdCard] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "idCard") setIdCard(e.target.files[0]);
    if (e.target.name === "profileImage") setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      // Only send extra fields if role is student
      if (form.role !== "student" && ["section", "course", "semester"].includes(key)) return;
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
        console.log("Registration failed:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 flex flex-col gap-4">
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="border p-2" required />
      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="border p-2" required />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="border p-2" required />
      <select name="role" value={form.role} onChange={handleChange} className="border p-2" required>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      {form.role === "student" && (
        <>
          <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="border p-2" required />
          <input name="course" value={form.course} onChange={handleChange} placeholder="Course" className="border p-2" required />
          <input name="semester" value={form.semester} onChange={handleChange} placeholder="Semester" className="border p-2" required />
        </>
      )}
      <label>
        ID Card (required):
        <input name="idCard" type="file" accept="image/*" onChange={handleFileChange} required />
      </label>
      <label>
        Profile Image (optional):
        <input name="profileImage" type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <button className="bg-blue-600 text-white p-2 rounded" type="submit">Register</button>
    </form>
  );
}

export default RegisterPage;