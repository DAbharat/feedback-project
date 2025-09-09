import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminFormsList() {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/forms/forms", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      });
      setForms(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "teacher")) {
      fetchForms();
    }
    // eslint-disable-next-line
  }, [page]);

  if (!user || (user.role !== "admin" && user.role !== "teacher")) return <div>Access denied.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">All Feedback Forms</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={fetchForms} disabled={loading}>
        {loading ? "Loading..." : "Refresh"}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Questions</th>
              <th className="p-2 border">Active</th>
              <th className="p-2 border">Deadline</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.length === 0 ? (
              <tr><td colSpan={6} className="text-center p-4">No forms found.</td></tr>
            ) : (
              forms.map(form => (
                <tr key={form._id}>
                  <td className="p-2 border">{form.title}</td>
                  <td className="p-2 border">{form.description || "-"}</td>
                  <td className="p-2 border">{form.questions?.length || 0}</td>
                  <td className="p-2 border">{form.isActive ? "Yes" : "No"}</td>
                  <td className="p-2 border">{form.deadline ? new Date(form.deadline).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border flex flex-col gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mb-1"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          const res = await axios.get(`/api/v1/forms/${form._id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          alert(JSON.stringify(res.data.data, null, 2));
                        } catch (err) {
                          alert("Failed to fetch form details");
                        }
                      }}
                    >View</button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mb-1"
                      onClick={async () => {
                        const newTitle = prompt("Edit form title:", form.title);
                        if (!newTitle || newTitle === form.title) return;
                        try {
                          const token = localStorage.getItem("token");
                          await axios.patch(`/api/v1/forms/${form._id}/update`, { title: newTitle }, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          fetchForms();
                          alert("Form updated");
                        } catch (err) {
                          alert("Failed to update form");
                        }
                      }}
                    >Edit</button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded mb-1"
                      onClick={async () => {
                        if (!window.confirm("Are you sure you want to delete this form?")) return;
                        try {
                          const token = localStorage.getItem("token");
                          await axios.delete(`/api/v1/forms/${form._id}/delete`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          fetchForms();
                          alert("Form deleted");
                        } catch (err) {
                          alert("Failed to delete form");
                        }
                      }}
                    >Delete</button>
                    <button
                      className={`px-2 py-1 rounded ${form.isActive ? "bg-gray-500" : "bg-green-600"} text-white`}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          await axios.put(`/api/v1/forms/${form._id}/active`, { isActive: !form.isActive }, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          fetchForms();
                          alert(form.isActive ? "Form deactivated" : "Form activated");
                        } catch (err) {
                          alert("Failed to toggle form active state");
                        }
                      }}
                    >{form.isActive ? "Deactivate" : "Activate"}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminFormsList;
