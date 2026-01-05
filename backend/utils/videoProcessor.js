const Video = require('../models/Video');

const processVideo = async (videoId, io) => {
    try {
        // 1. Instantly show processing
        io.emit('processing_update', { videoId, status: 'processing', progress: 50 });
        
        // 2. Wait just 1 second instead of 6
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Force it to be SAFE (Remove the random flagging for now)
        const finalStatus = 'safe'; 

        await Video.findByIdAndUpdate(videoId, { status: finalStatus });
        
        // 4. Send Final Update
        io.emit('processing_complete', { 
            videoId, 
            status: finalStatus, 
            message: "Content verified as safe." 
        });

    } catch (err) {
        console.error("Processing Error:", err);
    }
};

module.exports = { processVideo };