import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { IoIosAddCircleOutline } from "react-icons/io";

const Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isActive, setIsActive] = useState(true); // For Active/Inactive status
  const [editId, setEditId] = useState(null);

  // Fetch data on component mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/auth/users/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.users);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Add/Update
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (editId === null) {
      if (!username || !password || password !== confirmPassword) {
        toast.warning("Please fill out all fields and confirm password.");
        return;
      }
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userData = { username, password, confirmPassword, role, isActive };
      if (editId !== null) {
        await axios.put(
          `http://localhost:5000/auth/update/${editId}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(
          data.map((d) =>
            d.id === editId ? { ...d, username, role, isActive } : d
          )
        );
        toast.success("Updated Successfully");
      } else {
        const res = await axios.post(
          "http://localhost:5000/auth/signup",
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData([...data, res.data]);
        toast.success("Added Successfully");
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding/updating data:", error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("user");
    setIsActive(true);
    setEditId(null);
  };

  // Handle Edit
  const handleEdit = (user) => {
    setUsername(user.username);
    setRole(user.role);
    setIsActive(user.isActive);
    setEditId(user.id);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-3 pt-1">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 flex items-center"
        >
          <IoIosAddCircleOutline size={20} className="mr-2" /> Add New User
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-center">{user.username}</td>
                  <td className="px-6 py-4 text-center">{user.role}</td>
                  <td className="px-6 py-4 text-center">
                    {user.isActive ? (
                      <div className="flex items-center justify-center">
                        <span className="h-4 w-4 bg-green-500 rounded-full mr-2"></span>
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="h-4 w-4 bg-red-500 rounded-full mr-2"></span>
                        <span>Inactive</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-green-500"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editId ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleAddOrUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required={editId !== null ? false : true}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required={editId !== null ? false : true}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required={editId !== null ? false : true}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Role</label>
                <div>
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === "user"}
                      onChange={() => setRole("user")}
                      className="mr-2"
                    />
                    User
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="superAdmin"
                      checked={role === "superAdmin"}
                      onChange={() => setRole("superAdmin")}
                      className="mr-2"
                    />
                    Super Admin
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <div>
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                      className="mr-2"
                    />
                    Inactive
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="bg-gray-300 text-black py-2 px-4 rounded-md                  mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {editId !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Data;
