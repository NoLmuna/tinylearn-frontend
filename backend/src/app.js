/* eslint-disable no-undef */
const express = require('express');
const app = express();
const parser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// Initialize database connection and models
require('./models/database');

// Routes
const UserRoutes = require('./routes/UserRoutes');
const LessonRoutes = require('./routes/LessonRoutes');
const ProgressRoutes = require('./routes/ProgressRoutes');

app.use(morgan('dev'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE');
    return res.status(200).json({});
  }
  next();
});

// Mount routes
app.use('/api/users', UserRoutes);
app.use('/api/lessons', LessonRoutes);
app.use('/api/progress', ProgressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TinyLearn API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

module.exports = app;
