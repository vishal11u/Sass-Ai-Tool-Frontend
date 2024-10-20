import React from 'react'
import { MdLogout } from 'react-icons/md'
import { logout } from '../../reduxAuth/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

function UserLogout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login')
    }

    return (
        <Tooltip title="Logout" arrow>
            <div className='items-center flex pl-3'>
                <button onClick={handleLogout}>
                    <MdLogout size={30} />
                </button>
            </div>
        </Tooltip>
    )
}

export default UserLogout