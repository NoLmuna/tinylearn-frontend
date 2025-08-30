import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import RealTimeMessaging from '../../../components/RealTimeMessaging';
import api from '../../../services/api';

const ParentMessages = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching parent messages data...');
      
      const [childrenResponse, teachersResponse] = await Promise.all([
        api.getParentChildren(),
        api.getUsers('teacher')
      ]);
      
      console.log('👨‍👩‍👧‍👦 Children response:', childrenResponse);
      console.log('👩‍🏫 Teachers response:', teachersResponse);
      
      // Handle children
      if (childrenResponse.success) {
        const childrenData = childrenResponse.data || [];
        console.log('✅ Children loaded:', childrenData);
        setChildren(childrenData);
        
        // Auto-select first child if available
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0]);
        }
      } else {
        console.error('❌ Failed to fetch children:', childrenResponse.message);
        setChildren([]);
      }

      // Handle teachers
      if (teachersResponse.success) {
        const teachersData = teachersResponse.data || [];
        console.log('✅ Teachers loaded:', teachersData);
        setTeachers(teachersData);
      } else {
        console.error('❌ Failed to fetch teachers:', teachersResponse.message);
        setTeachers([]);
      }

    } catch (error) {
      console.error('❌ Error fetching parent messages data:', error);
      toast.error('Failed to load data');
      setChildren([]);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <DashboardNavbar role="parent" currentPage="Messages" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Toaster position="top-right" />
      <DashboardNavbar role="parent" currentPage="Messages" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">
            Communicate with your child's teachers in real-time
          </p>
        </div>

        {/* Child Selection */}
        {children.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Select Child
            </h3>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedChild?.id === child.id
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {child.firstName} {child.lastName}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* No children message */}
        {children.length === 0 && (
          <Card className="p-8 text-center">
            <UserIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Children Found
            </h3>
            <p className="text-gray-600">
              Please contact the school administrator to link your account with your children.
            </p>
          </Card>
        )}

        {/* Real-Time Messaging Component */}
        {selectedChild && teachers.length > 0 && (
          <RealTimeMessaging 
            teachers={teachers}
            selectedChild={selectedChild}
            user={user}
          />
        )}

        {/* No teachers message */}
        {selectedChild && teachers.length === 0 && (
          <Card className="p-8 text-center">
            <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Teachers Available
            </h3>
            <p className="text-gray-600">
              No teachers are currently available for messaging.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentMessages;
