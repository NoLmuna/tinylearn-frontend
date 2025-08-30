import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {
  UserIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../hooks/useAuth';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import { useSocket } from '../../../contexts/SocketContext';
import api from '../../../services/api';

const TeacherMessagesRedesigned = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);

  // Filter parents based on search
  const filteredParents = parents.filter(parent =>
    `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching teacher messages data...');
      
      const parentsResponse = await api.getParentsForTeacher();
      console.log('👨‍👩‍👧‍👦 Parents response:', parentsResponse);
      
      if (parentsResponse.success) {
        const parentsData = parentsResponse.data || [];
        console.log('✅ Parents loaded:', parentsData);
        setParents(parentsData);
        
        // Auto-select first parent if available
        if (parentsData.length > 0 && !selectedParent) {
          setSelectedParent(parentsData[0]);
        }
      } else {
        console.error('❌ Failed to fetch parents:', parentsResponse.message);
        setParents([]);
        toast.error('Failed to load parents');
      }
    } catch (error) {
      console.error('❌ Error fetching teacher messages data:', error);
      toast.error('Failed to load messaging data');
      setParents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedParent]);

  const fetchMessages = useCallback(async () => {
    if (!selectedParent) return;
    
    try {
      const response = await api.getMessagesWithUser(selectedParent.id);
      if (response.success) {
        const conversationMessages = response.data || [];
        setMessages(conversationMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      } else {
        console.error('❌ Failed to fetch messages:', response);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [selectedParent]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedParent || sending) return;

    try {
      setSending(true);
      const response = await api.sendMessage({
        receiverId: selectedParent.id,
        content: newMessage.trim()
      });

      if (response.success) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Socket.IO listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (messageData) => {
      if (
        selectedParent && 
        (messageData.senderId === selectedParent.id || messageData.receiverId === selectedParent.id)
      ) {
        setMessages(prev => [...prev, messageData]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, selectedParent]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar role="teacher" currentPage="Messages" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <DashboardNavbar role="teacher" currentPage="Messages" />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-140px)] flex overflow-hidden">
          
          {/* Sidebar - Parents List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
              
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Parents List */}
            <div className="flex-1 overflow-y-auto">
              {filteredParents.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <UserIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No parents found</p>
                </div>
              ) : (
                <div className="space-y-1 p-3">
                  {filteredParents.map((parent) => (
                    <button
                      key={parent.id}
                      onClick={() => setSelectedParent(parent)}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 border ${
                        selectedParent?.id === parent.id 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                            {parent.firstName?.charAt(0)}{parent.lastName?.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {parent.firstName} {parent.lastName}
                          </p>
                          <p className="text-xs text-gray-500">Parent</p>
                        </div>
                        {isConnected && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Connection Status */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedParent ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedParent.firstName?.charAt(0)}{selectedParent.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedParent.firstName} {selectedParent.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">Parent</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Start a conversation with {selectedParent.firstName}</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isOwnMessage = message.senderId === user.id;
                      const showTime = index === 0 || 
                        (new Date(message.createdAt) - new Date(messages[index - 1].createdAt)) > 300000; // 5 minutes
                      
                      return (
                        <div key={message.id} className="space-y-2">
                          {showTime && (
                            <div className="text-center">
                              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-blue-500 text-white rounded-br-md'
                                  : 'bg-white text-gray-900 rounded-bl-md border shadow-sm'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                              }`}>
                                <span className="text-xs">
                                  {formatTime(message.createdAt)}
                                </span>
                                {isOwnMessage && (
                                  <CheckIcon className="h-3 w-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className={`p-3 rounded-full transition-colors ${
                        newMessage.trim() && !sending
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Parent Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a parent</h3>
                  <p className="text-gray-500">Choose a parent from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessagesRedesigned;
