import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CommonLoader from '../../../common/CommonLoader';

const COLORS = ['#FFD700', '#8884d8'];

function DrHospShare() {
    const [data, setData] = useState([
        { name: 'Return', value: 0 },
        { name: 'Delivered', value: 0 }
    ]);
    const [activeButton, setActiveButton] = useState('Day');
    const [loading, setLoading] = useState(true);

    const handleButtonClick = (button) => {
        setActiveButton(button);
        fetchData();
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://ecommerce-backend-three-eta.vercel.app/api/dashboard');
            const { delivered, returned } = response.data.orders;

            const totalDelivered = delivered.reduce((acc, item) => acc + item.count, 0);
            const totalReturned = returned.reduce((acc, item) => acc + item.count, 0);

            setData([
                { name: 'Return', value: totalReturned },
                { name: 'Delivered', value: totalDelivered }
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderCustomLabel = ({ value }) => `${value}`;

    return (
        <div className='w-[20%] h-[39vh] border shadow py-1 bg-white mt-2 px-2 rounded-md overflow-hidden'>
            <div className='flex items-center justify-between space-x-1 border-b pb-1.5 pt-0.5'>
                <h1 className='font-semibold text-[14px]'>Delivered and Return Orders</h1>
            </div>
            <div className='w-full h-[calc(100%-2rem)] mt-2'>
                <div className='flex justify-around text-[13px] font-medium'>
                    <div>
                        <button
                            type='button'
                            className={`border px-2 py-0.5 rounded-l ${activeButton === 'Day' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}
                            onClick={() => handleButtonClick('Day')}
                        >
                            Day
                        </button>
                        <button
                            type='button'
                            className={`border px-2 py-0.5 ${activeButton === 'Week' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}
                            onClick={() => handleButtonClick('Week')}
                        >
                            Week
                        </button>
                        <button
                            type='button'
                            className={`border px-2 py-0.5 rounded-r ${activeButton === 'Month' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}
                            onClick={() => handleButtonClick('Month')}
                        >
                            Month
                        </button>
                    </div>
                    <div className=''>
                        <div className='flex items-center'>
                            <span className='bg-indigo-500 h-2.5 w-2.5 inline-block rounded-full mr-1'></span>
                            <h1 className='text-[12px] font-medium'>Delivered</h1>
                        </div>
                        <div className='flex items-center'>
                            <span className='bg-yellow-500 h-2.5 w-2.5 inline-block rounded-full mr-1'></span>
                            <h1 className='text-[12px] font-medium'>Return</h1>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <CommonLoader />
                    </div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" className={"-mt-5 overflow-hidden"}>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={data}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                // margin={{
                                //     top: 10,
                                //     right: 5,
                                //     left: -21,
                                //     bottom: 0,
                                // }}
                                innerRadius={45}
                                outerRadius={80}
                                fill="#82ca9d"
                                label={renderCustomLabel}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className='w-full h-[80%] flex items-center justify-center font-medium text-[16px]'>No data available</p>
                )}
            </div>
        </div>
    );
}

export default DrHospShare;
