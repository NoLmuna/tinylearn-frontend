const { Message, User } = require('../models');
const send = require('../utils/response');
const { Op } = require('sequelize');

const MessageController = {
    async sendMessage(req, res) {
        try {
            const { receiverId, content } = req.body;
            const senderId = req.user?.userId || req.user?.id;

            if (!senderId) {
                return send.sendResponseMessage(res, 401, null, 'User ID not found in token');
            }

            if (!receiverId || !content) {
                return send.sendResponseMessage(res, 400, null, 'Receiver and content are required');
            }

            // Check if receiver exists
            const receiver = await User.findByPk(receiverId);
            if (!receiver) {
                return send.sendResponseMessage(res, 404, null, 'Receiver not found');
            }

            // Create the message
            const message = await Message.create({
                senderId,
                receiverId,
                content
            });

            // Emit real-time message if Socket.IO is available
            if (req.app.get('io')) {
                req.app.get('io').emit('newMessage', {
                    id: message.id,
                    senderId,
                    receiverId,
                    content,
                    timestamp: message.createdAt
                });
            }

            return send.sendResponseMessage(res, 201, message, 'Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
            return send.sendResponseMessage(res, 500, null, 'Failed to send message');
        }
    },

    async getMessages(req, res) {
        try {
            const userId = req.user?.userId || req.user?.id;
            const { otherUserId } = req.params;

            if (!userId) {
                return send.sendResponseMessage(res, 401, null, 'User ID not found in token');
            }

            if (!otherUserId) {
                return send.sendResponseMessage(res, 400, null, 'Other user ID is required');
            }

            // Get all messages between the two users
            const messages = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: userId }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'firstName', 'lastName', 'role']
                    },
                    {
                        model: User,
                        as: 'receiver',
                        attributes: ['id', 'firstName', 'lastName', 'role']
                    }
                ],
                order: [['createdAt', 'ASC']]
            });

            return send.sendResponseMessage(res, 200, messages, 'Messages retrieved successfully');
        } catch (error) {
            console.error('Error getting messages:', error);
            return send.sendResponseMessage(res, 500, null, 'Failed to retrieve messages');
        }
    },

    async getConversations(req, res) {
        try {
            console.log('🔍 req.user:', req.user);
            console.log('🔍 req.userData:', req.userData);
            
            const userId = req.user?.userId || req.user?.id;
            console.log('🔍 Extracted userId:', userId);

            if (!userId) {
                return send.sendResponseMessage(res, 401, null, 'User ID not found in token');
            }

            // Get all unique conversations for this user
            const conversations = await Message.findAll({
                where: {
                    [Op.or]: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'firstName', 'lastName', 'role']
                    },
                    {
                        model: User,
                        as: 'receiver',
                        attributes: ['id', 'firstName', 'lastName', 'role']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            // Group by conversation partner
            const conversationMap = new Map();
            conversations.forEach(message => {
                const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
                const partner = message.senderId === userId ? message.receiver : message.sender;
                
                if (!conversationMap.has(partnerId)) {
                    conversationMap.set(partnerId, {
                        partnerId,
                        partner,
                        lastMessage: message,
                        unreadCount: 0
                    });
                }
            });

            const conversationList = Array.from(conversationMap.values());
            return send.sendResponseMessage(res, 200, conversationList, 'Conversations retrieved successfully');
        } catch (error) {
            console.error('Error getting conversations:', error);
            return send.sendResponseMessage(res, 500, null, 'Failed to retrieve conversations');
        }
    }
};

module.exports = MessageController;
