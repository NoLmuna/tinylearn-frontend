/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const userGuard = require('../middleware/user-guard');

// Protected routes - all message routes require authentication
router.use(userGuard);

// Send message
router.post('/', MessageController.sendMessage);

// Get messages
router.get('/received', MessageController.getReceivedMessages);
router.get('/sent', MessageController.getSentMessages);
router.get('/stats', MessageController.getMessageStats);
router.get('/contacts', MessageController.getContacts);

// Conversation with specific user
router.get('/conversation/:userId', MessageController.getConversation);

// Mark message as read
router.patch('/:id/read', MessageController.markAsRead);

// Get specific message
router.get('/:id', MessageController.getMessageById);

module.exports = router;
