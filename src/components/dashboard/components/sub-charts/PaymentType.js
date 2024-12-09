import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CommonLoader from "../../../common/CommonLoader";

function PaymentType() {
  const [data, setData] = useState([]);
  const [activeButton, setActiveButton] = useState("month");
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const getDateRange = (filter) => {
    const now = new Date();
    let startDate;

    if (filter === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (filter === "week") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === "month") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return { startDate, endDate: new Date() };
  };

  const fetchContactData = async (filter) => {
    setLoading(true);
    const { startDate, endDate } = getDateRange(filter);

    try {
      const response = await axios.get(
        `https://best-aitool-backend.vercel.app/dashboard/contacts/${activeButton}`
      );
      const contactEntries = response.data;

      const filteredContacts = contactEntries.filter((contact) => {
        const contactDate = new Date(contact.createdAt);
        return contactDate >= startDate && contactDate <= endDate;
      });

      // Aggregate contacts by day
      const aggregatedData = filteredContacts.reduce((acc, contact) => {
        const contactDate = new Date(contact.createdAt).toLocaleDateString();
        if (!acc[contactDate]) {
          acc[contactDate] = 0;
        }
        acc[contactDate] += 1;
        return acc;
      }, {});

      const chartData = Object.keys(aggregatedData).map((date) => ({
        date,
        count: aggregatedData[date],
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData(activeButton);
  }, [activeButton]);

  return (
    <div className="w-[50%] h-[39vh] border shadow py-1 mt-2 px-2 ml-3 bg-white rounded-md overflow-hidden">
      <div className="flex items-center justify-between space-x-1 border-b pb-1.5 pt-0.5">
        <h1 className="font-semibold text-[14px]">Contact Count (Day-wise)</h1>
        <div className="flex items-center text-[13px] font-medium">
          <button
            type="button"
            className={`border px-2 py-0.5 rounded-l ${
              activeButton === "day"
                ? "bg-blue-700 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleButtonClick("day")}
          >
            Day
          </button>
          <button
            type="button"
            className={`border px-2 py-0.5 ${
              activeButton === "week"
                ? "bg-blue-700 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleButtonClick("week")}
          >
            Week
          </button>
          <button
            type="button"
            className={`border px-2 py-0.5 rounded-r ${
              activeButton === "month"
                ? "bg-blue-700 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleButtonClick("month")}
          >
            Month
          </button>
        </div>
      </div>
      {/* ------------- Chart section -------------- */}
      <div className="w-full h-[calc(100%-2rem)] flex justify-between">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CommonLoader />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="w-full h-full flex items-center justify-center font-medium text-[18px]">
            No data available
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentType;
