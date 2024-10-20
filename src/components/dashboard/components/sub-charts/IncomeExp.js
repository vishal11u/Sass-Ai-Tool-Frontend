import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CommonLoader from '../../../common/CommonLoader';

function IncomeExp() {
    const [data, setData] = useState([]);
    const [activeButton, setActiveButton] = useState('Day');
    const [loading, setLoading] = useState(false);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const fetchData = async (filter) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/dashboard/ai-tools/week');
            const { incomeExpenses } = response.data;

            const getDayName = (date) => {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return dayNames[new Date(date).getDay()];
            };

            const groupedData = incomeExpenses.reduce((acc, { type, amount, date }) => {
                const dayName = getDayName(new Date(date).toISOString().split('T')[0]);
                if (!acc[dayName]) acc[dayName] = { income: 0, expense: 0 };
                acc[dayName][type] += amount;
                return acc;
            }, {});

            const chartData = Object.keys(groupedData).map(day => ({
                name: day,
                Income: groupedData[day].income,
                Expenses: groupedData[day].expense
            }));

            setData(chartData);
        } catch (error) {
            console.error('Error fetching income and expenses data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeButton.toLowerCase());
    }, [activeButton]);

    return (
        <div className='w-[50%] h-[39vh] border px-2 py-1 mt-2 shadow rounded-md overflow-hidden bg-white'>
            <div className='flex items-center justify-between space-x-1 border-b pb-1.5 pt-0.5'>
                <h1 className='font-semibold text-[14px]'>Income v/s Expenses</h1>
                <div className='flex items-center space-x-2 font-medium text-[14px]'>
                    <div className='flex items-center'>
                        <span className='bg-green-500 h-3 w-3 inline-block rounded-full mr-1'></span>
                        <h1>Income</h1>
                    </div>
                    <div className='flex items-center'>
                        <span className='bg-red-500 h-3 w-3 inline-block rounded-full mr-1'></span>
                        <h1>Expenses</h1>
                    </div>
                </div>
                <div className='flex items-center text-[13px] font-medium'>
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
            </div>
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
                                left: -10,
                                bottom: 0,
                            }}
                        >
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="Income" stroke="green" strokeWidth={1.5} />
                            <Line type="monotone" dataKey="Expenses" stroke="red" strokeWidth={1.5} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className='w-full h-full flex items-center justify-center font-medium text-[18px]'>No data available</p>
            )}
        </div>
    );
}

export default IncomeExp;
