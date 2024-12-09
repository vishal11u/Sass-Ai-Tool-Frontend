import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea, CardActions, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import AddNewCard from "./components/AddNewCard";
import axios from "axios";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
import { FaOpencart } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";

function CardsSection() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);
  const [editData, setEditData] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://best-aitool-backend.vercel.app/aitools", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
      setNoData(res.data.length === 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://best-aitool-backend.vercel.app/aitools/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.filter((card) => card._id !== id));
      toast.success("Card deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete card.");
    }
  };

  const handleEdit = (card) => {
    setEditData(card);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[20px] font-semibold text-gray-800">
          Ai Tools Collection
        </h1>
        <button
          className="bg-indigo-600 text-white py-2 text-[14px] px-4 rounded-lg flex items-center gap-x-1 shadow-md hover:bg-indigo-700 transition duration-300"
          onClick={openModal}
        >
          <FaOpencart size={20} /> Add New AI Tool
        </button>
      </div>
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from(new Array(4)).map((_, index) => (
              <Card
                key={index}
                sx={{
                  maxWidth: 345,
                  borderRadius: "16px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardActionArea>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={40} width="80%" />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Skeleton variant="text" height={60} width="100%" />
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Skeleton variant="rectangular" width={120} height={36} />
                </CardActions>
              </Card>
            ))}
          </div>
        ) : noData ? (
          <Typography
            variant="h6"
            color="text.secondary"
            className="text-center col-span-full"
          >
            No cards available
          </Typography>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 w-full">
            {data.length > 0 &&
              data.map((list, index) => (
                <div
                  key={index}
                  className="p-4 border w-full rounded-lg shadow-md bg-white overflow-hidden relative transition-all ease-in-out duration-200 hover:scale-[1.02]"
                >
                  {/* Price Square */}
                  <div className="absolute top-6 left-6 bg-blue-500 font-medium text-white rounded-md px-2 py-1 text-sm">
                    {list?.pricing}
                  </div>
                  <div className="flex absolute justify-between gap-x-2 top-44 right-6">
                    <button
                      className="bg-blue-500 text-white rounded-md py-1 px-1 font-medium"
                      type="button"
                      onClick={() => handleEdit(list)}
                    >
                      <MdModeEditOutline size={20} />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded-md py-1 px-1 font-medium"
                      type="button"
                      onClick={() => handleDelete(list._id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>

                  <img
                    src={list?.imageUrl}
                    alt="images"
                    className="h-48 w-full rounded-md"
                  />
                  <p className="font-semibold pt-2 pl-1 text-lg">
                    {list?.productName}
                  </p>
                  <button
                    className="bg-gray-200 capitalize rounded-md py-1 px-2 font-medium my-1"
                    type="button"
                  >
                    {list?.category}
                  </button>
                  <p className="text-gray-600 pt-1 mt-1 border-t">
                    <span className="font-semibold text-black">Tag Line</span>:{" "}
                    {list?.tagline}
                  </p>

                  {/* Edit and Delete Buttons */}
                  {/* <div className="flex justify-between gap-x-2 pt-5 Pb-5 px-3 absolute bottom-0 right-0">
                    <button
                      className="bg-blue-500 text-white rounded-md py-1 px-3 font-medium"
                      type="button"
                      onClick={() => handleEdit(list)}
                    >
                      <MdEditNote size={20} />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded-md py-1 px-3 font-medium"
                      type="button"
                      onClick={() => handleDelete(list._id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddNewCard
          isOpen={isModalOpen}
          onClose={closeModal}
          setData={setData}
          editData={editData}
          setEditData={setEditData}
        />
      )}
    </div>
  );
}

export default CardsSection;
