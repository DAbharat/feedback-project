import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "student",
    section: "",
    course: "",
    specialization: "",
    year: "",
    semester: "",
  });
  const [idCard, setIdCard] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
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
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
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
          <label className="font-semibold">Section:</label>
          <select name="section" value={form.section} onChange={handleChange} className="border p-2" required>
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <div>
            <label className="font-semibold">Course:</label>
            <select
              name="course"
              className="border p-2 w-full"
              value={form.course}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {courseOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {(form.course === "BBA" || form.course === "BCA" || form.course === "BTech") && (
            <div>
              <label className="font-semibold">Specialization:</label>
              <select
                name="specialization"
                className="border p-2 w-full"
                value={form.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                {specializationOptions[form.course].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="font-semibold">Year:</label>
            <select
              name="year"
              className="border p-2 w-full"
              value={form.year}
              onChange={handleChange}
              required
              disabled={!form.course}
            >
              <option value="">Select Year</option>
              {yearOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Semester:</label>
            <select
              name="semester"
              className="border p-2 w-full"
              value={form.semester}
              onChange={handleChange}
              required
              disabled={!form.course}
            >
              <option value="">Select Semester</option>
              {semesterOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
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