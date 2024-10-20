import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

function AddNewCard({
    isOpen,
    onClose,
    setData,
    editData,
    setEditData
}) {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        title: '',
        subtitle: '',
        description: '',
        price: ''
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || '',
                image: editData.image || '',
                title: editData.title || '',
                subtitle: editData.subtitle || '',
                description: editData.description || '',
                price: editData.price || ''
            });
            setIsEdit(true);
        } else {
            setFormData({
                name: '',
                image: '',
                title: '',
                subtitle: '',
                description: '',
                price: ''
            });
            setIsEdit(false);
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (isEdit) {
                res = await axios.put(`https://ecommerce-backend-three-eta.vercel.app/api/card/${editData._id}`, formData);
                toast.success('Card updated successfully!');
            } else {
                res = await axios.post('https://ecommerce-backend-three-eta.vercel.app/api/card', formData);
                toast.success('Card added successfully!');
            }
            setData(prevData => isEdit ? prevData.map(card => card._id === res.data._id ? res.data : card) : [...prevData, res.data]);
            onClose();
            setEditData(null);
            setFormData({
                name: '',
                image: '',
                title: '',
                subtitle: '',
                description: '',
                price: ''
            })
        } catch (error) {
            toast.error('Failed to save card.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Card' : 'Add New Card'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Image URL"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        placeholder="Subtitle"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {isEdit ? 'Update Card' : 'Add Card'}
                        </button>
                        <button
                            type="button"
                            className="ml-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddNewCard;
