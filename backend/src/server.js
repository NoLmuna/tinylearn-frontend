/* eslint-disable no-undef */
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`📡 User connected: ${socket.id}`);

    // Join user to their specific room based on role and ID
    socket.on('join-room', (userData) => {
        const { userId, role } = userData;
        const roomName = `${role}_${userId}`;
        socket.join(roomName);
        socket.userId = userId;
        socket.userRole = role;
        console.log(`� User ${userId} (${role}) joined room: ${roomName}`);
    });

    // Handle new message
    socket.on('send-message', (messageData) => {
        console.log('💬 New message:', messageData);
        
        // Emit to the receiver's room
        const receiverRoom = `${messageData.receiverRole}_${messageData.receiverId}`;
        socket.to(receiverRoom).emit('new-message', messageData);
        
        // Also emit back to sender for confirmation
        socket.emit('message-sent', messageData);
    });

    // Handle message read status
    socket.on('mark-message-read', (messageData) => {
        const senderRoom = `${messageData.senderRole}_${messageData.senderId}`;
        socket.to(senderRoom).emit('message-read', messageData);
    });

    // Handle typing indicators
    socket.on('typing-start', (typingData) => {
        const receiverRoom = `${typingData.receiverRole}_${typingData.receiverId}`;
        socket.to(receiverRoom).emit('user-typing', {
            userId: socket.userId,
            userRole: socket.userRole,
            isTyping: true
        });
    });

    socket.on('typing-stop', (typingData) => {
        const receiverRoom = `${typingData.receiverRole}_${typingData.receiverId}`;
        socket.to(receiverRoom).emit('user-typing', {
            userId: socket.userId,
            userRole: socket.userRole,
            isTyping: false
        });
    });

    socket.on('disconnect', () => {
        console.log(`📡 User disconnected: ${socket.id}`);
    });
});

// Make io available to other modules
app.set('io', io);

server.listen(port, () => {
    console.log(`�🚀 TinyLearn API server running on http://localhost:${port}`);
    console.log(`📋 Health check: http://localhost:${port}/api/health`);
    console.log(`🔌 Socket.IO server ready for real-time messaging`);
});