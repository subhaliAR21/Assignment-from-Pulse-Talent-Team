const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const app = express();
const server = http.createServer(app);
const videoRoutes = require('./routes/videoRoutes');
const io = new Server(server, {
    cors: { origin: "*" } // Allow frontend access
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.set('socketio', io);
app.use('/uploads', express.static('uploads'));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send("Pulse Video API is running...");
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});