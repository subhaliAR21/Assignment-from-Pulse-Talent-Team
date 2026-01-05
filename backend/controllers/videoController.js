const Video = require('../models/Video');
const { processVideo } = require('../utils/videoProcessor');

exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

        const newVideo = new Video({
            title: req.body.title || req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            userId: req.user.id,
            tenantId: req.user.tenantId
        });

        await newVideo.save();

        // --- NEW: Trigger Processing ---
        // We get 'io' from the app object (we'll set this in server.js next)
        const io = req.app.get('socketio');
        processVideo(newVideo._id, io); 
        // -------------------------------

        res.status(201).json({ msg: "Video uploaded and processing started", video: newVideo });
    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};

// --- NEW: Get Videos for Video Library ---
exports.getVideos = async (req, res) => {
    try {
        // Multi-tenant isolation: Only fetch videos belonging to user's tenantId
        const videos = await Video.find({ tenantId: req.user.tenantId });
        res.json(videos);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
const fs = require('fs');
const path = require('path');

exports.streamVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ msg: "Video not found" });

        // Ensure the user belongs to the same tenant as the video
        if (video.tenantId !== req.user.tenantId) {
            return res.status(403).json({ msg: "Unauthorized access to this video" });
        }

        const videoPath = path.resolve(video.path);
        const videoSize = fs.statSync(videoPath).size;

        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 10**6, videoSize - 1); // 1MB chunks

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            
            const head = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head); // 206 = Partial Content
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': videoSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (err) {
        res.status(500).json({ msg: "Streaming error", error: err.message });
    }
};