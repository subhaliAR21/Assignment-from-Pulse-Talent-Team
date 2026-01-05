const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    uploadVideo, 
    getVideos, 
    streamVideo 
} = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp + original name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit 100MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

// --- Routes ---

/**
 * @route   POST /api/videos/upload
 * @desc    Upload video & trigger real-time sensitivity analysis
 * @access  Private (Admin, Editor)
 */
router.post(
    '/upload', 
    protect, 
    authorize('editor', 'admin'), 
    upload.single('video'), 
    uploadVideo
);

/**
 * @route   GET /api/videos
 * @desc    Get all videos for the user's specific tenant (Multi-tenant)
 * @access  Private (All Roles)
 */
router.get(
    '/', 
    protect, 
    getVideos
);

/**
 * @route   GET /api/videos/stream/:id
 * @desc    Stream video using HTTP Range Requests
 * @access  Private (All Roles - Tenant Isolated)
 */
router.get(
    '/stream/:id', 
    protect, 
    streamVideo
);

module.exports = router;