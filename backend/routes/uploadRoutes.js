import express from 'express';
import upload from '../middleware/uploadMiddleware.js'; // Multer middleware
import cloudinary from '../config/cloudinary.js'; // Cloudinary config
import { protect, admin } from '../middleware/authMiddleware.js'; // security

const router = express.Router();

// POST /api/upload
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // --- simple and reliable upload logic ---

    // 1. Convert Multer file buffer to a Base64 data URI
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // 2. Upload the Base64 string to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'JohanS-hub', // folder name in Cloudinary
      resource_type: 'image',
    });

    // 3. On successful upload, return the URL to the frontend
    res.status(201).json({
      message: 'Image uploaded successfully',
      url: result.secure_url, // Cloudinary secure URL
    });
    
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ message: 'Error uploading image.', error: err.message });
  }
});

export default router;