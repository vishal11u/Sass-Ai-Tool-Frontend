import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from 'react-icons/io';

const Data = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState('user');
    const [editId, setEditId] = useState(null);

    // Fetch data on component mount
    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/auth/users/list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.users);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    console.log(data);

    useEffect(() => {
        fetchData();
    }, []);

    // Handle Add/Update
    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.warning("Please fill out all fields.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userData = { username, password, confirmPassword, role };
            if (editId) {
                await axios.put(`http://localhost:5000/auth/update/${editId}`, userData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(data.map(d => (d.id === editId ? { ...d, username, role } : d)));
                toast.success("Updated Successfully");
            } else {
                const res = await axios.post('http://localhost:5000/auth/signup', userData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData([...data, res.data]);
                toast.success("Added Successfully");
                setShowModal(false)
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error adding/updating data:', error);
            toast.error(error?.message);
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setUsername('');
        setPassword('');
        setRole('user');
        setEditId(null);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/auth/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(data.filter(d => d._id !== id));
            toast.success("Deleted Successfully");
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error("Failed to delete data");
        } finally {
            setLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = (user) => {
        setUsername(user.username);
        setRole(user.role);
        setEditId(user._id);
        setShowModal(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 flex items-center">
                <IoIosAddCircleOutline className="mr-2" /> Add New User
            </button>
            {loading ? <p>Loading...</p> : (
                <table className="min-w-full bg-white border rounded-md overflow-hidden shadow-md">
                    <thead className='bg-gray-800 text-white'>
                        <tr >
                            <th className="px-4 py-2 border">Username</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border">Type</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user) => (
                            <tr key={user._id}>
                                <td className="px-4 py-2 border">{user.username}</td>
                                <td className="px-4 py-2 border">{user.role}</td>
                                <td className="px-4 py-2 border">{user.type}</td>
                                <td className="px-4 py-2 border">
                                    <button onClick={() => handleEdit(user)} className="text-green-500 mr-2"><FaEdit /></button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-500"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{editId ? 'Edit User' : 'Add New User'}</h3>
                        <form onSubmit={handleAddOrUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
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
                                            checked={role === 'user'}
                                            onChange={() => setRole('user')}
                                            className="mr-2"
                                        />
                                        User
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="superAdmin"
                                            checked={role === 'superAdmin'}
                                            onChange={() => setRole('superAdmin')}
                                            className="mr-2"
                                        />
                                        Super Admin
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => setShowModal(false)} type="button" className="bg-gray-300 text-black py-2 px-4 rounded-md mr-2">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                                    {editId ? 'Update' : 'Add'}
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
