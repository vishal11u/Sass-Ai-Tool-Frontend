import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CommonLoader from '../../../common/CommonLoader';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function OPDIncome() {
    const [data, setData] = useState([]);
    const [activeButton, setActiveButton] = useState('week');
    const [loading, setLoading] = useState(false);

    const handleButtonClick = (button) => {
        setActiveButton(button);
        fetchSignupData(button);
    };

    const fetchSignupData = async (filter) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/dashboard/login-signup/${activeButton}`);
            const fetchedData = response.data;

            const orderData = [
                {
                    name: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
                    users: fetchedData.signupCount
                }
            ];

            if (filter === 'day') {
                setData(orderData);
            } else if (filter === 'week') {
                const weekData = daysOfWeek.map((day, index) => {
                    const dayData = index === 0 ? orderData[0] : { name: day, users: 0 };
                    return dayData;
                });
                setData(weekData);
            } else if (filter === 'month') {
                const monthData = Array.from({ length: 30 }, (_, index) => ({
                    name: `Day ${index + 1}`,
                    users: index === 0 ? fetchedData.signupCount : 0
                }));
                setData(monthData);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSignupData(activeButton);
    }, [activeButton]);

    return (
        <div className='w-[39.5%] h-[39vh] border shadow py-1 mt-2 px-2 ml-2 bg-white rounded-md overflow-hidden'>
            <div className='flex items-center justify-between space-x-1 border-b pb-1.5 pt-0.5'>
                <h1 className='font-semibold text-[14px]'>Users Signup</h1>
                <div className='flex items-center text-[13px] font-medium'>
                    <button
                        type='button'
                        className={`border px-2 py-0.5 rounded-l ${activeButton === 'day' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}
                        onClick={() => handleButtonClick('day')}
                    >
                        Day
                    </button>
                    <button
                        type='button'
                        className={`border px-2 py-0.5 ${activeButton === 'week' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}
                        onClick={() => handleButtonClick('week')}
                    >
                        Week
                    </button>
                    <button
                        type='button'
                        className={`border px-2 py-0.5 rounded-r ${activeButton === 'month' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}
                        onClick={() => handleButtonClick('month')}
                    >
                        Month
                    </button>
                </div>
            </div>
            {/* --------------------------------------- */}
            {loading ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <CommonLoader />
                </div>
            ) : data.length > 0 ? (
                <div className='w-full h-[calc(100%-2rem)]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            width={500}
                            height={300}
                            margin={{
                                top: 10,
                                right: 5,
                                left: -21,
                                bottom: 0,
                            }}
                        >
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="blue" strokeWidth={1.5} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className='w-full h-full flex items-center justify-center'>
                    <p className='font-medium text-[18px]'>No data available</p>
                </div>
            )}
        </div>
    );
}

export default OPDIncome;
