const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.any(), async (req, res, next) => {
    // Filter files to only include those from the 'images' field
    const imageFiles = req.files ? req.files.filter(file => file.fieldname === 'images') : [];

    if (imageFiles.length === 0) {
        return res.status(400).json({ success: false, message: 'Please upload at least one file with the field name "images"' });
    }

    try {
        const uploadPromises = imageFiles.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "zionbazaar" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve({
                            url: result.secure_url,
                            public_id: result.public_id,
                        });
                    }
                );
                uploadStream.end(file.buffer);
            });
        });

        const results = await Promise.all(uploadPromises);
        
        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            data: results, // Returns an array of {url, public_id}
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
