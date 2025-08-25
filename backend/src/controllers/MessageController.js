/* eslint-disable no-undef */
const { Message, User, StudentParent } = require('../models');
const { sendResponse } = require('../utils/response');
const { Op } = require('sequelize');

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, subject, content, messageType, priority, attachments, relatedStudentId } = req.body;
        const senderId = req.user.id;

        // Validate receiver exists
        const receiver = await User.findByPk(receiverId);
        if (!receiver) {
            return sendResponse(res, 404, 'error', 'Receiver not found');
        }

        // Check if sender has permission to message receiver
        if (req.user.role === 'parent' && receiver.role === 'teacher') {
            // Parent can only message teachers of their children
            const hasPermission = await StudentParent.findOne({
                where: {
                    parentId: senderId,
                    studentId: relatedStudentId || { [Op.ne]: null }
                }
            });

            if (!hasPermission) {
                return sendResponse(res, 403, 'error', 'You can only message teachers of your children');
            }
        }

        const message = await Message.create({
            senderId,
            receiverId,
            subject,
            content,
            messageType: messageType || 'general',
            priority: priority || 'medium',
            attachments: attachments || [],
            relatedStudentId
        });

        const messageWithDetails = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'relatedStudent', attributes: ['id', 'firstName', 'lastName'], required: false }
            ]
        });

        sendResponse(res, 201, 'success', 'Message sent successfully', messageWithDetails);
    } catch (error) {
        console.error('Send message error:', error);
        sendResponse(res, 500, 'error', 'Failed to send message');
    }
};

// Get received messages
const getReceivedMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, isRead, messageType, priority } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { receiverId: userId };

        if (isRead !== undefined) {
            whereClause.isRead = isRead === 'true';
        }

        if (messageType && messageType !== 'all') {
            whereClause.messageType = messageType;
        }

        if (priority && priority !== 'all') {
            whereClause.priority = priority;
        }

        const messages = await Message.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'relatedStudent', attributes: ['id', 'firstName', 'lastName'], required: false }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        sendResponse(res, 200, 'success', 'Messages retrieved successfully', {
            messages: messages.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: messages.count,
                pages: Math.ceil(messages.count / limit)
            }
        });
    } catch (error) {
        console.error('Get received messages error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve messages');
    }
};

// Get sent messages
const getSentMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, messageType } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { senderId: userId };

        if (messageType && messageType !== 'all') {
            whereClause.messageType = messageType;
        }

        const messages = await Message.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'relatedStudent', attributes: ['id', 'firstName', 'lastName'], required: false }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        sendResponse(res, 200, 'success', 'Sent messages retrieved successfully', {
            messages: messages.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: messages.count,
                pages: Math.ceil(messages.count / limit)
            }
        });
    } catch (error) {
        console.error('Get sent messages error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve sent messages');
    }
};

// Mark message as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const message = await Message.findOne({
            where: { id, receiverId: userId }
        });

        if (!message) {
            return sendResponse(res, 404, 'error', 'Message not found');
        }

        if (!message.isRead) {
            await message.update({
                isRead: true,
                readAt: new Date()
            });
        }

        const updatedMessage = await Message.findByPk(id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'relatedStudent', attributes: ['id', 'firstName', 'lastName'], required: false }
            ]
        });

        sendResponse(res, 200, 'success', 'Message marked as read', updatedMessage);
    } catch (error) {
        console.error('Mark as read error:', error);
        sendResponse(res, 500, 'error', 'Failed to mark message as read');
    }
};

// Get message by ID
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const message = await Message.findByPk(id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'relatedStudent', attributes: ['id', 'firstName', 'lastName'], required: false }
            ]
        });

        if (!message) {
            return sendResponse(res, 404, 'error', 'Message not found');
        }

        // Check permissions
        if (message.senderId !== userId && message.receiverId !== userId) {
            return sendResponse(res, 403, 'error', 'You do not have permission to view this message');
        }

        // Mark as read if user is the receiver and message is unread
        if (message.receiverId === userId && !message.isRead) {
            await message.update({
                isRead: true,
                readAt: new Date()
            });
        }

        sendResponse(res, 200, 'success', 'Message retrieved successfully', message);
    } catch (error) {
        console.error('Get message by ID error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve message');
    }
};

// Get conversation between two users
const getConversation = async (req, res) => {
    try {
        const { userId: otherUserId } = req.params;
        const currentUserId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const offset = (page - 1) * limit;

        const messages = await Message.findAndCountAll({
            where: {
                [Op.or]: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId }
                ]
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] },
                { model: User, as: 'relatedStudent', attributes: ['id', 'firstName', 'lastName'], required: false }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'ASC']]
        });

        // Mark received messages as read
        await Message.update(
            { isRead: true, readAt: new Date() },
            { 
                where: { 
                    senderId: otherUserId, 
                    receiverId: currentUserId, 
                    isRead: false 
                } 
            }
        );

        sendResponse(res, 200, 'success', 'Conversation retrieved successfully', {
            messages: messages.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: messages.count,
                pages: Math.ceil(messages.count / limit)
            }
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve conversation');
    }
};

// Get message statistics
const getMessageStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = {
            unreadCount: await Message.count({
                where: { receiverId: userId, isRead: false }
            }),
            totalReceived: await Message.count({
                where: { receiverId: userId }
            }),
            totalSent: await Message.count({
                where: { senderId: userId }
            }),
            urgentCount: await Message.count({
                where: { receiverId: userId, priority: 'urgent', isRead: false }
            })
        };

        sendResponse(res, 200, 'success', 'Message statistics retrieved successfully', stats);
    } catch (error) {
        console.error('Get message stats error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve message statistics');
    }
};

// Get available contacts for messaging
const getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let contacts = [];

        if (userRole === 'parent') {
            // Parents can message teachers of their children
            await StudentParent.findAll({
                where: { parentId: userId },
                include: [
                    { 
                        model: User, 
                        as: 'student', 
                        attributes: ['id', 'firstName', 'lastName', 'grade']
                    }
                ]
            });

            // Get all teachers (simplified - in real app, you'd get teachers assigned to specific children)
            contacts = await User.findAll({
                where: { role: 'teacher', isActive: true },
                attributes: ['id', 'firstName', 'lastName', 'email']
            });

        } else if (userRole === 'teacher') {
            // Teachers can message parents of their students
            contacts = await User.findAll({
                where: { role: 'parent', isActive: true },
                attributes: ['id', 'firstName', 'lastName', 'email']
            });

        } else if (userRole === 'admin') {
            // Admins can message everyone
            contacts = await User.findAll({
                where: { 
                    id: { [Op.ne]: userId },
                    isActive: true 
                },
                attributes: ['id', 'firstName', 'lastName', 'email', 'role']
            });
        }

        sendResponse(res, 200, 'success', 'Contacts retrieved successfully', contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        sendResponse(res, 500, 'error', 'Failed to retrieve contacts');
    }
};

module.exports = {
    sendMessage,
    getReceivedMessages,
    getSentMessages,
    markAsRead,
    getMessageById,
    getConversation,
    getMessageStats,
    getContacts
};
