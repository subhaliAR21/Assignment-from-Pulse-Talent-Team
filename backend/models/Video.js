const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'safe', 'flagged'], 
        default: 'pending' 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: String, required: true } // For multi-tenant isolation
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);