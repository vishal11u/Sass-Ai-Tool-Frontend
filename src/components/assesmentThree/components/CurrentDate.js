import React, { useState, useEffect } from 'react';

function CurrentDate() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000);

        return () => {
            clearInterval(timerID);
        };
    }, []);

    const tick = () => {
        setCurrentTime(new Date());
    };

    const date = currentTime.getDate();
    const monthIndex = currentTime.getMonth();
    const year = currentTime.getFullYear();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const monthName = monthNames[monthIndex];

    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return (
        <div className='text-sm border-l border-r px-4'>
            <h1>{date}  {monthName}  {year}</h1>
            <h1 className='text-center'>{displayHours}:{minutes}:{seconds} {amOrPm}</h1>
        </div>
    );
}

export default CurrentDate;
