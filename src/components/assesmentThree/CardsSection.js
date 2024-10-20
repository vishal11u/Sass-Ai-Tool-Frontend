import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import AddNewCard from './components/AddNewCard';
import axios from 'axios';
import { toast } from 'sonner';
import { MdEditNote } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaOpencart } from "react-icons/fa";

function CardsSection() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [editData, setEditData] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem('token');
      const res = await axios.get('https://ecommerce-backend-three-eta.vercel.app/api/card');
      setData(res.data);
      setNoData(res.data.length === 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ecommerce-backend-three-eta.vercel.app/api/card/${id}`);
      setData(prevData => prevData.filter(card => card._id !== id));
      toast.success('Card deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete card.');
    }
  };

  const handleEdit = (card) => {
    setEditData(card)
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='bg-white h-full w-full'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-[20px] font-semibold text-gray-800'>
          Product Collection
        </h1>
        <button
          className="bg-indigo-600 text-white py-2 text-[14px] px-4 rounded-lg flex items-center gap-x-1 shadow-md hover:bg-indigo-700 transition duration-300"
          onClick={openModal}
        >
          <FaOpencart size={20} />  Add New Product
        </button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {loading ? (
          Array.from(new Array(8)).map((_, index) => (
            <Card key={index} sx={{ maxWidth: 345, borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
          ))
        ) : noData ? (
          <Typography variant="h6" color="text.secondary" className="text-center col-span-full">
            No cards available
          </Typography>
        ) : (
          data.length > 0 && data.map((card, index) => (
            <Card key={index} sx={{ maxWidth: 345, borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden', padding: "0px", overflowX: "hidden" }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="1200"
                  image={card.image}
                  alt="Card Image"
                  sx={{ height: 250, width: "100%", objectFit: 'cover', backgroundPosition: "center", backgroundSize: "cover", mt: 0, borderRadius: 2, border: "0px solid black" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2" component="div" sx={{ mt: -1, color: 'gray', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '2.6em', /* approximately 3 lines */ }}>
                    {card.subtitle.length > 30 ? `${card.subtitle.substring(0, 30)}...` : card.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                className='bg-indigo-500'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: "space-between",
                  mt: -1,
                  px: 3,
                }}
              >
                <Typography className='text-white'>
                  ${card.price}
                </Typography>
                <Typography className='space-x-2'>
                  <Button size="small" variant="contained" color="error" sx={{ borderRadius: '12px', textTransform: 'none', }} onClick={() => handleDelete(card?._id)}>
                    <MdDelete size={20} />
                  </Button>
                  <Button size="small" variant="contained" color="primary" sx={{ borderRadius: '12px', textTransform: 'none', }} onClick={() => handleEdit(card)}>
                    <MdEditNote size={22} />
                  </Button>
                </Typography>
              </CardActions>
            </Card>
          ))
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