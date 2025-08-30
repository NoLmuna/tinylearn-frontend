import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      // Initialize socket connection
      const newSocket = io('http://localhost:3000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      // Set up connection event handlers
      newSocket.on('connect', () => {
        console.log('🔌 Connected to Socket.IO server');
        setIsConnected(true);
        
        // Join user's room
        newSocket.emit('join-room', {
          userId: user.id,
          role: user.role
        });
      });

      newSocket.on('disconnect', () => {
        console.log('📡 Disconnected from Socket.IO server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // Socket helper functions
  const sendMessage = (messageData) => {
    if (socket && isConnected) {
      socket.emit('send-message', messageData);
    }
  };

  const markMessageAsRead = (messageData) => {
    if (socket && isConnected) {
      socket.emit('mark-message-read', messageData);
    }
  };

  const startTyping = (receiverData) => {
    if (socket && isConnected) {
      socket.emit('typing-start', receiverData);
    }
  };

  const stopTyping = (receiverData) => {
    if (socket && isConnected) {
      socket.emit('typing-stop', receiverData);
    }
  };

  const joinRoom = (roomName) => {
    if (socket && isConnected) {
      socket.emit('join-room', roomName);
    }
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping,
    joinRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
