import React, { useState } from 'react'
import { MdLogout } from 'react-icons/md'
import { logout } from '../../reduxAuth/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

function UserLogout() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Logout Button with Tooltip */}
            <Tooltip title="Logout" arrow>
                <div className='items-center flex pl-3'>
                    <button onClick={openModal}>
                        <MdLogout size={30} />
                    </button>
                </div>
            </Tooltip>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="font-semibold mb-4 text-gray-800 text-center text-[25px]">Are you sure you want to logout?</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 text-[14px] font-medium text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-[14px] font-medium text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                onClick={handleLogout}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserLogout;
