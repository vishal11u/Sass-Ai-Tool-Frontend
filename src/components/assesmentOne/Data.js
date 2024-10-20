import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoIosAddCircleOutline } from "react-icons/io";

const Data = () => {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://ecommerce-backend-three-eta.vercel.app/api/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name || !contactNumber || !email) {
            toast.warning("Please fill out all fields.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://ecommerce-backend-three-eta.vercel.app/api/data', { name, contactNumber, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData([...data, res.data]);
            setName('');
            setContactNumber('');
            setEmail('');
            setShowModal(false);
            toast.success("Added Successfully");
        } catch (error) {
            console.error('Error adding data:', error);
            toast.warning("Failed to add data");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setName('');
        setContactNumber('');
        setEmail('');
    }

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://ecommerce-backend-three-eta.vercel.app/api/data/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(data.filter(d => d._id !== id));
            toast.success("Deleted Successfully");
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.warning("Failed to delete data");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (d) => {
        setLoading(true);
        try {
            setName(d.name);
            setContactNumber(d.contactNumber);
            setEmail(d.email);
            setEditId(d._id);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching data for edit:', error);
            toast.warning("Failed to fetch data for edit");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !contactNumber || !email) {
            toast.warning("Please fill out all fields.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const updatedData = { name, contactNumber, email };
            const res = await axios.put(`https://ecommerce-backend-three-eta.vercel.app/api/data/${editId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(data.map(d => (d._id === editId ? res.data : d)));
            setName('');
            setContactNumber('');
            setEmail('');
            setEditId(null);
            setShowModal(false);
            toast.success("Updated Successfully");
        } catch (error) {
            console.error('Error updating data:', error);
            toast.warning("Failed to update data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-[20px] font-semibold mb-3">Customers Details Management</h1>
            <div className='w-full'>
                <button
                    className="bg-indigo-500 flex items-center float-righ gap-x-1 text-white text-[14px] py-2 px-3 rounded-md mb-4"
                    onClick={() => {
                        setShowModal(true);
                        setEditId(null);
                    }}
                >
                   <IoIosAddCircleOutline size={19}/> Add Details
                </button>
                {/* <button className='py-2 px-3 rounded-md bg-red-500' type='button' onClick={handleLogout}>
                    <MdOutlineLogout color='white' size={25} />
                </button> */}
            </div>

            {/* Modal for adding/updating data */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-4">{editId ? 'Update Data' : 'Add New Data'}</h2>
                        <form onSubmit={editId ? handleUpdate : handleAdd}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                            />
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="Contact Number"
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {editId ? 'Update' : 'Add'}
                                </button>
                                <button
                                    type="button"
                                    className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Display "No data available" message when data array is empty */}
            {data.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-4">No data available</div>
            )}

            {/* Display loading spinner while fetching data */}
            {loading && (
                <div className="text-center text-gray-500 mt-4">Loading...</div>
            )}

            {/* Table displaying data */}
            {!loading && data.length > 0 && (
                <table className="border-collapse w-full mt-1 rounded-md">
                    <thead>
                        <tr className="bg-indigo-500 ">
                            <th className="px-4 py-2 text-white rounded-tl-lg">Name</th>
                            <th className="px-4 py-2 text-white">Contact Number</th>
                            <th className="px-4 py-2 text-white">Email</th>
                            <th className="px-4 py-2 text-white rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(d => (
                            <tr key={d._id} className="hover:bg-gray-100 border-b ">
                                <td className="px-4 py-2 text-center bg-white border-l">{d.name}</td>
                                <td className="px-4 py-2 text-center bg-white">{d.contactNumber}</td>
                                <td className="px-4 py-2 text-center bg-white">{d.email}</td>
                                <td className="px-4 py-2 text-center bg-white border-r">
                                    <button
                                        className="bg-red-500 text-white py-1.5 px-2 rounded-md mr-2"
                                        onClick={() => handleDelete(d._id)}
                                        disabled={loading}
                                    >
                                        <FaTrash size={15} color='white' />
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white py-1.5 px-2 rounded-md"
                                        onClick={() => handleEdit(d)}
                                        disabled={loading}
                                    >
                                        <FaEdit size={15} color='white' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Data;