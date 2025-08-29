import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  EnvelopeIcon,
  PlusIcon,
  PaperAirplaneIcon,
  UserIcon,
  CalendarDaysIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const TeacherMessages = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeData, setComposeData] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [parents, setParents] = useState([]);

  useEffect(() => {
    fetchMessages();
    fetchParents();
    
    // Check if we came from student page with recipient data
    if (location.state?.recipient) {
      setShowCompose(true);
      setComposeData(prev => ({
        ...prev,
        recipient: location.state.recipient.id,
        subject: `Regarding ${location.state.recipient.firstName} ${location.state.recipient.lastName}`
      }));
    }
  }, [location.state]);

  const filterMessages = React.useCallback(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (filterType) {
      case 'unread':
        filtered = filtered.filter(message => !message.isRead);
        break;
      case 'sent':
        // For now, assume we don't have sent messages in the data
        filtered = [];
        break;
      case 'important':
        filtered = filtered.filter(message => message.priority === 'high');
        break;
      default:
        break;
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, filterType]);

  useEffect(() => {
    filterMessages();
  }, [filterMessages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.getMessages();
      
      if (response.success) {
        // Handle both direct array and nested object format
        const messagesData = response.data;
        const messagesList = Array.isArray(messagesData) ? messagesData : (messagesData.messages || []);
        setMessages(messagesList);
      } else {
        toast.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await api.getUsers();
      
      if (response.success) {
        // Handle both direct array and nested object format
        const allUsers = response.data || [];
        const parentUsers = allUsers.filter(user => user.role === 'parent');
        setParents(parentUsers);
      }
    } catch (error) {
      console.error('Failed to fetch parents:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!composeData.recipient || !composeData.subject.trim() || !composeData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const messageData = {
        recipientId: composeData.recipient,
        subject: composeData.subject,
        content: composeData.content,
        priority: 'normal'
      };

      const response = await api.sendMessage(messageData);
      
      if (response.success) {
        toast.success('Message sent successfully!');
        setShowCompose(false);
        setComposeData({ recipient: '', subject: '', content: '' });
        fetchMessages();
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.markMessageAsRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await api.deleteMessage(messageId);
        
        if (response.success) {
          toast.success('Message deleted successfully');
          setSelectedMessage(null);
          fetchMessages();
        } else {
          toast.error('Failed to delete message');
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardNavbar role="teacher" currentPage="Messages" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardNavbar role="teacher" currentPage="Messages" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
            </div>
            <Button onClick={() => setShowCompose(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Compose Message
            </Button>
          </div>
          <p className="text-gray-600">Communicate with parents and guardians</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Search messages..."
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="sent">Sent</option>
                  <option value="important">Important</option>
                </select>
              </div>
            </Card>

            {/* Message List */}
            <div className="space-y-3">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <Card
                    key={message.id}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedMessage?.id === message.id 
                        ? 'ring-2 ring-purple-500 bg-purple-50' 
                        : !message.isRead 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {message.senderName?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {message.senderName || 'Parent'}
                              </span>
                              {!message.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Recent'}
                            </div>
                          </div>
                        </div>
                        <h3 className={`font-medium mb-1 ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMessage(message);
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {messages.length === 0 ? 'No messages yet' : 'No messages match your filter'}
                  </h3>
                  <p className="text-gray-600">
                    {messages.length === 0 
                      ? 'Messages from parents will appear here'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Compose Message Form */}
            {showCompose && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compose Message</h3>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient
                    </label>
                    <select
                      value={composeData.recipient}
                      onChange={(e) => setComposeData(prev => ({ ...prev, recipient: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a parent</option>
                      {parents.map(parent => (
                        <option key={parent.id} value={parent.id}>
                          {parent.firstName} {parent.lastName}
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
                      value={composeData.subject}
                      onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Message subject"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={composeData.content}
                      onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="4"
                      placeholder="Type your message..."
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1">
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowCompose(false);
                        setComposeData({ recipient: '', subject: '', content: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Message Detail */}
            {selectedMessage && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Message Details</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-800">
                        {selectedMessage.senderName || 'Parent'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedMessage.senderEmail || 'No email'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                    <div className="text-sm text-gray-600">
                      {selectedMessage.createdAt 
                        ? new Date(selectedMessage.createdAt).toLocaleString()
                        : 'Recently received'
                      }
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {selectedMessage.subject}
                    </h4>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowCompose(true);
                        setComposeData({
                          recipient: selectedMessage.senderId || '',
                          subject: `Re: ${selectedMessage.subject}`,
                          content: ''
                        });
                      }}
                      className="w-full"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Messages</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unread</span>
                  <span className="font-medium text-blue-600">
                    {messages.filter(m => !m.isRead).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium">
                    {messages.filter(m => {
                      const messageDate = new Date(m.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return messageDate > weekAgo;
                    }).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
