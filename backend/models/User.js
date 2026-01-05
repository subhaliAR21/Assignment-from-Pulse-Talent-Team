const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['viewer', 'editor', 'admin'], 
        default: 'viewer' 
    },
    // Multi-tenant: This groups users. In a simple app, it can be their own ID.
    tenantId: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);