/* eslint-disable no-undef */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Initialize database connection and models
require('./models/database');

// Routes
const UserRoutes = require('./routes/UserRoutes');
const LessonRoutes = require('./routes/LessonRoutes');
const ProgressRoutes = require('./routes/ProgressRoutes');
const AssignmentRoutes = require('./routes/AssignmentRoutes');
const SubmissionRoutes = require('./routes/SubmissionRoutes');
const MessageRoutes = require('./routes/MessageRoutes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Mount routes
app.use('/api/users', UserRoutes);
app.use('/api/lessons', LessonRoutes);
app.use('/api/progress', ProgressRoutes);
app.use('/api/assignments', AssignmentRoutes);
app.use('/api/submissions', SubmissionRoutes);
app.use('/api/messages', MessageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TinyLearn API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Import error handling middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
