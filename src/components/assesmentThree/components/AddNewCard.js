import React, { useEffect, useState } from "react";
import {
  Modal,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { toast } from "sonner";
import app from "../../../FirebaseConfigue";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  overflowY: "auto",
  borderRadius: 2,
};

const AddNewCard = ({ isOpen, onClose, setData, editData, setEditData }) => {
  const [formData, setFormData] = useState({
    productName: editData?.productName || "",
    category: editData?.category || "",
    tagline: editData?.tagline || "",
    description: editData?.description || "",
    url: editData?.url || "",
    imageUrl: editData?.imageUrl || "",
    pricing: editData?.pricing || "",
    keyFeatures: editData?.keyFeatures || "",
    howToUse: editData?.howToUse || "",
    videoUrl: editData?.videoUrl || "",
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUrl = (e) => {
    const image = e.target.files[0];
    if (image) {
      setPreviewImage(URL.createObjectURL(image));
      setFormData((prevData) => ({ ...prevData, imageUrl: image }));
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please upload an image.");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/" + formData.imageUrl.name);
      await uploadBytes(storageRef, formData.imageUrl);
      const downloadURL = await getDownloadURL(storageRef);

      const payload = {
        ...formData,
        imageUrl: downloadURL,
        keyFeatures: formData.keyFeatures
          .split(",")
          .map((feature) => feature.trim()),
      };

      const token = localStorage.getItem("token");

      if (editData && editData !== null) {
        const response = await axios.put(
          `https://best-aitool-backend.vercel.app/aitools/update/${editData._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Card updated successfully!");
        setData((prev) =>
          prev.map((item) => (item.id === editData.id ? response.data : item))
        );
      } else {
        const response = await axios.post(
          "https://best-aitool-backend.vercel.app/aitools/save",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Card added successfully!");
        setData((prev) => [...prev, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      category: "",
      tagline: "",
      description: "",
      url: "",
      imageUrl: null,
      pricing: "",
      keyFeatures: "",
      howToUse: "",
      videoUrl: "",
    });
    setEditData(null);
    setPreviewImage("");
    onClose();
  };

  useEffect(() => {
    if (editData && editData.imageUrl) {
      setPreviewImage(editData.imageUrl);
    } else {
      setPreviewImage("");
    }
  }, [editData]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <form onSubmit={handleUploadImage} className="modal-content">
          <Typography variant="h5" borderBottom="1px solid gray">
            {editData ? "Edit Card :" : "Add New Card :"}
          </Typography>
          <TextField
            label="Product Name"
            fullWidth
            size="small"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Category"
            fullWidth
            size="small"
            name="category"
            value={formData.category}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Tagline"
            fullWidth
            size="small"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            size="small"
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="URL"
            fullWidth
            size="small"
            name="url"
            value={formData.url}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Pricing"
            fullWidth
            size="small"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Key Features (comma separated)"
            fullWidth
            size="small"
            name="keyFeatures"
            value={formData.keyFeatures}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="How to Use"
            fullWidth
            size="small"
            multiline
            rows={2}
            name="howToUse"
            value={formData.howToUse}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Video URL"
            fullWidth
            size="small"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            margin="normal"
          />
          <div className="p-2 border shadow-md rounded-md w-1/2 mx-auto overflow-hidde">
            <label
              htmlFor="file-upload"
              className="cursor-pointer relative mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
            >
              {!previewImage ? (
                <div className="text-center h-48 flex flex-col items-center justify-center">
                  <div className="text-4xl text-blue-600 font-bold">+</div>
                  <p className="text-gray-500 mt-1">Upload Image</p>
                </div>
              ) : (
                <img
                  //   src={editData !== null ? editData?.imageUrl : previewImage}
                  src={editData?.imageUrl || previewImage}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              )}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageUrl}
              className="hidden"
            />
            {previewImage && (
              <button
                onClick={() => setPreviewImage("")}
                variant="contained"
                type="button"
                color="error"
                className="text-center border w-full bg-red-600 rounded py-1 mt-1 font-medium text-white"
              >
                Change Image
              </button>
            )}
            {error && <p className="error-text">{error}</p>}
          </div>
          <Button
            type="submit"
            variant="contained"
            color={!editData ? "success" : "primary"}
            disabled={uploading}
            fullWidth
            sx={{
              textTransform: "capitalize",
              mt: 2,
            }}
          >
            {uploading ? (
              <CircularProgress size={24} />
            ) : editData ? (
              "Update"
            ) : (
              "Submit"
            )}{" "}
            Card
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddNewCard;
