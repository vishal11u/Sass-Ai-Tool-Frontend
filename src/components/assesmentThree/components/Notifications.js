import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import { IoNotificationsCircle } from "react-icons/io5";
import axios from 'axios';
import { IoCheckmarkDone } from "react-icons/io5";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { FcBusinessman } from "react-icons/fc";
import { FcBusinesswoman } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';

function Notifications() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/notifications/admin/all');
            setUnreadCount(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className='mr-6'>
            <Tooltip title="Notifications" arrow>
                <div className='border rounded-full mt-2 cursor-pointer'>
                    <Badge badgeContent={unreadCount?.unreadCount} color="warning" onClick={handleOpen}>
                        <IoNotificationsCircle size={35} />
                    </Badge>
                </div>
            </Tooltip>
            {open && (
                <NotificationModal
                    open={open}
                    handleClose={handleClose}
                />
            )}
        </div>
    );
}

export default Notifications;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 550,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 0,
    overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: 2,
    border: "none"
};
function NotificationModal({ open, handleClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const response = await axios.get('http://localhost:5000/notifications/admin/all');
            setNotifications(response.data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            await axios.put('http://localhost:5000/notifications/markAllRead');
            setNotifications(notifications.map(notification => ({ ...notification, isRead: false })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    // const sortedNotifications = notifications
    //     .sort((a, b) => {
    //         if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    //         return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
    //     });

    return (
        <Modal
            open={open}
            aria-labelledby="notifications-modal"
            aria-describedby="notifications-list"
        >
            <Box sx={style}>
                <div className='sticky left-0 top-0 z-10 bg-white px-4 py-3 flex items-center border-none justify-between overflow-hidden'>
                    <div className='flex items-center gap-x-1.5'>
                        <button type='button' onClick={handleClose}>
                            <IoChevronBackCircleSharp size={25} />
                        </button>
                        <h1 className='text-[20px] font-semibold'>
                            Notifications
                        </h1>
                    </div>
                    <button type='button'
                        className='py-1.5 px-2.5 flex items-center gap-x-1 bg-gray-700 text-white rounded-md text-[14px]'
                        onClick={markAllAsRead}
                    >
                        <IoCheckmarkDone size={16} />
                        Mark All Read
                    </button>
                </div>
                <div>
                    {loading && (
                        <div className="flex justify-center items-center">
                            <h1 className='text-[20px] font-semibold text-center text-gray-600'>
                                Loading...
                            </h1>
                        </div>
                    )}
                    {notifications?.notifications?.length > 0 ? (
                        notifications?.notifications?.map((notification) => (
                            <div key={notification.id} className={`bg-${notification?.isRead ? 'gray-200' : 'blue-100'} shadow border px-3 py-1.5 gap-y-1 mb-2 mx-3 rounded-md flex items-center justify-between`}>
                                <div className='text-left'>
                                    <h1 className='font-semibold text-[17px]'>
                                        {notification?.message}
                                    </h1>
                                    <p className='text-[13px] font-medium text-gray-600 gap-x-4 pt-0.5 flex items-center'>
                                        Date: {new Date(notification.createdAt).toLocaleDateString()}
                                        <span>
                                            Time: {new Date(notification.createdAt).toLocaleTimeString()}
                                        </span>
                                    </p>
                                </div>
                                <div className='text-right space-y-1'>
                                    <Tooltip title={notification.isRead ? "Read" : "UnRead"} arrow placement='left'>
                                        <p className='text-[13px] mx-auto bg-blue-500 font-medium px-4 py-1 text-white rounded-md'>
                                            {notification.isRead ? "Read" : "UnRead"}
                                        </p>
                                    </Tooltip>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Typography sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: 25
                        }}
                        >
                            <p className='text-[20px] font-semibold'>
                                No notifications available
                                <span className='animate-pulse'>
                                    ...
                                </span>
                            </p>
                        </Typography>
                    )}
                </div>
            </Box>
        </Modal>
    );
}
