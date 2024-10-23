import React, { useState } from 'react';
import { Modal, TextField, Button, Typography, CircularProgress, Box } from '@mui/material';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { toast } from 'sonner';

const AddNewCard = ({ isOpen, onClose, setData, editData, setEditData }) => {
    const [productName, setProductName] = useState(editData?.productName || '');
    const [category, setCategory] = useState(editData?.category || '');
    const [tagline, setTagline] = useState(editData?.tagline || '');
    const [description, setDescription] = useState(editData?.description || '');
    const [url, setUrl] = useState(editData?.url || '');
    const [imageURL, setImageURL] = useState(null);
    const [pricing, setPricing] = useState(editData?.pricing || '');
    const [keyFeatures, setKeyFeatures] = useState(editData?.keyFeatures || []);
    const [howToUse, setHowToUse] = useState(editData?.howToUse || '');
    const [videoUrl, setVideoUrl] = useState(editData?.videoUrl || '');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleUploadImage = async () => {
        if (!imageURL) return;
        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            const storage = getStorage();
            const storageRef = ref(storage, "images/" + imageURL.name);
            await uploadBytes(storageRef, imageURL);
            const downloadURL = await getDownloadURL(storageRef);

            const payload = {
                productName,
                category,
                tagline,
                description,
                url,
                imageUrl: downloadURL,
                pricing,
                keyFeatures,
                howToUse,
                videoUrl
            };

            const response = await axios.post("http://localhost:5000/aitools/save", payload, {
                headers: {
                    Authorization: `Bearer YOUR_TOKEN_HERE`
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.floor((loaded * 100) / total);
                    setProgress(percent);
                }
            });

            toast.success('Card added successfully!');
            setData(prev => [...prev, response.data]); // Assuming the API returns the new card
            resetForm();
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setProductName('');
        setCategory('');
        setTagline('');
        setDescription('');
        setUrl('');
        setImageURL(null);
        setPricing('');
        setKeyFeatures([]);
        setHowToUse('');
        setVideoUrl('');
        setEditData(null);
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={{ backgroundColor: "white",width:600,height:600,overflowY:"auto" }}>
                <div className="modal-content">
                    <Typography variant="h6">{editData ? "Edit Card" : "Add New Card"}</Typography>
                    <TextField
                        label="Product Name"
                        fullWidth
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Category"
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Tagline"
                        fullWidth
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="URL"
                        fullWidth
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Pricing"
                        fullWidth
                        value={pricing}
                        onChange={(e) => setPricing(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Key Features (comma separated)"
                        fullWidth
                        value={keyFeatures.join(', ')}
                        onChange={(e) => setKeyFeatures(e.target.value.split(',').map(feature => feature.trim()))}
                        margin="normal"
                    />
                    <TextField
                        label="How to Use"
                        fullWidth
                        multiline
                        rows={2}
                        value={howToUse}
                        onChange={(e) => setHowToUse(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Video URL"
                        fullWidth
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        margin="normal"
                    />
                    <input
                        type="file"
                        onChange={(e) => setImageURL(e.target.files[0])}
                    />
                    {uploading && <CircularProgress variant="determinate" value={progress} />}
                    {error && <Typography color="error">{error}</Typography>}
                    <Button onClick={handleUploadImage} variant="contained" color="primary">
                        {editData ? 'Update' : 'Add'} Card
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default AddNewCard;
