import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import Card from './ui/Card';
import Button from './ui/Button';
import { useSocket } from '../contexts/SocketContext';
import api from '../services/api';

const RealTimeMessaging = ({ teachers, selectedChild, user, isTeacher = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ 
    subject: '', 
    content: '', 
    receiverId: '' 
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { socket, isConnected, sendMessage, markMessageAsRead } = useSocket();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch existing messages
  const fetchMessages = React.useCallback(async () => {
    try {
      const response = await api.getMessages();
      if (response.success) {
        setMessages(response.data.messages || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (messageData) => {
      console.log('📨 Received new message:', messageData);
      setMessages(prev => [...prev, messageData]);
      
      // Show notification
      toast.success(`New message from ${messageData.sender.firstName} ${messageData.sender.lastName}`);
      
      // Mark as read if user is viewing messages
      markMessageAsRead({
        messageId: messageData.id,
        senderId: messageData.senderId,
        senderRole: messageData.sender.role
      });
      
      scrollToBottom();
    };

    const handleMessageSent = (messageData) => {
      console.log('✅ Message sent confirmation:', messageData);
      // Message already added optimistically, just update status if needed
    };

    const handleUserTyping = (typingData) => {
      if (typingData.isTyping) {
        setTypingUsers(prev => new Set([...prev, typingData.userId]));
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(typingData.userId);
          return newSet;
        });
      }
    };

    const handleMessageRead = (messageData) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageData.messageId 
          ? { ...msg, isRead: true }
          : msg
      ));
    };

    socket.on('new-message', handleNewMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('user-typing', handleUserTyping);
    socket.on('message-read', handleMessageRead);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('user-typing', handleUserTyping);
      socket.off('message-read', handleMessageRead);
    };
  }, [socket, markMessageAsRead]);

  // Handle typing indicators
  const handleTypingStart = () => {
    if (!isTyping && newMessage.receiverId) {
      setIsTyping(true);
      const receiver = teachers.find(t => t.id === parseInt(newMessage.receiverId));
      if (receiver && socket) {
        socket.emit('typing-start', {
          receiverId: receiver.id,
          receiverRole: receiver.role
        });
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000);
  };

  const handleTypingStop = () => {
    if (isTyping && newMessage.receiverId) {
      setIsTyping(false);
      const receiver = teachers.find(t => t.id === parseInt(newMessage.receiverId));
      if (receiver && socket) {
        socket.emit('typing-stop', {
          receiverId: receiver.id,
          receiverRole: receiver.role
        });
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.subject.trim() || !newMessage.content.trim() || !newMessage.receiverId) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const messageData = {
        receiverId: parseInt(newMessage.receiverId),
        subject: newMessage.subject.trim(),
        content: newMessage.content.trim(),
        messageType: 'general',
        priority: 'medium'
      };

      // Add related student ID if available
      if (selectedChild) {
        messageData.relatedStudentId = selectedChild.id;
      }

      // Add optimistic message to UI
      const optimisticMessage = {
        id: Date.now(), // Temporary ID
        senderId: user.id,
        receiverId: messageData.receiverId,
        subject: messageData.subject,
        content: messageData.content,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        receiver: teachers.find(t => t.id === messageData.receiverId)
      };

      setMessages(prev => [...prev, optimisticMessage]);
      
      // Send via API
      const response = await api.sendMessage(messageData);
      
      if (response.success) {
        // Update optimistic message with real data
        setMessages(prev => prev.map(msg => 
          msg.id === optimisticMessage.id 
            ? { ...response.data, isOptimistic: false }
            : msg
        ));

        // Send via Socket.IO for real-time delivery
        const receiver = teachers.find(t => t.id === messageData.receiverId);
        if (receiver && socket) {
          sendMessage({
            ...response.data,
            receiverRole: receiver.role,
            senderRole: user.role
          });
        }

        // Reset form
        setNewMessage({ subject: '', content: '', receiverId: '' });
        toast.success('Message sent successfully!');
        
        // Stop typing
        handleTypingStop();
      } else {
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id === Date.now()));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Messages Display */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
        
        <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No messages yet. Start a conversation with a teacher!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.senderId === user.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <UserCircleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {message.senderId === user.id 
                          ? 'You' 
                          : `${message.sender?.firstName} ${message.sender?.lastName}`
                        }
                      </span>
                    </div>
                    <p className="font-medium text-sm mb-1">{message.subject}</p>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-75">
                        {formatDate(message.createdAt)}
                      </span>
                      {message.senderId === user.id && (
                        <span className={`text-xs ${
                          message.isRead ? 'text-blue-200' : 'text-gray-300'
                        }`}>
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicators */}
              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {isTeacher ? 'Parent is typing...' : 'Teacher is typing...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Form */}
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isTeacher ? 'Send to Parent' : 'Send to Teacher'}
            </label>
            <select
              value={newMessage.receiverId}
              onChange={(e) => setNewMessage(prev => ({ ...prev, receiverId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">{isTeacher ? 'Select a parent...' : 'Select a teacher...'}</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) => {
                setNewMessage(prev => ({ ...prev, subject: e.target.value }));
                handleTypingStart();
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={
                selectedChild 
                  ? `${isTeacher ? 'Message about' : 'Message regarding'} ${selectedChild.firstName} ${selectedChild.lastName}...`
                  : 'Enter message subject...'
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={newMessage.content}
              onChange={(e) => {
                setNewMessage(prev => ({ ...prev, content: e.target.value }));
                handleTypingStart();
              }}
              onBlur={handleTypingStop}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !isConnected}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RealTimeMessaging;
