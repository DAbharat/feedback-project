import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function AdminUserTable() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const res = await axios.get("/api/v1/users/all-users", {
        headers: { Authorization: `Bearer ${token}` },
        params,
        withCredentials: true,
      });
      setUsers(res.data.data || []);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [roleFilter, search]);

  if (!user || user.role !== "admin") return <div>Access denied.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input
          className="border p-2"
          type="text"
          placeholder="Search by name, email, or username"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={fetchUsers} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-4">No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u._id}>
                  <td className="p-2 border">{u.fullName}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.username}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border text-center">
                    {u.role === "admin" && u._id !== user._id && (
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={async () => {
                          if (!window.confirm(`Are you sure you want to demote ${u.fullName} to teacher?`)) return;
                          try {
                            const token = localStorage.getItem("token");
                            await axios.patch(`/api/v1/users/demote/${u._id}`, {}, {
                              headers: { Authorization: `Bearer ${token}` },
                              withCredentials: true,
                            });
                            alert("Admin demoted successfully");
                            fetchUsers();
                          } catch (err) {
                            alert("Failed to demote admin");
                          }
                        }}
                      >
                        Demote
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserTable;
