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

const TeacherMessages = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching teacher messages data...');
      
      const [studentsResponse, parentsResponse] = await Promise.all([
        api.getStudents(),
        api.getUsers('parent')
      ]);
      
      console.log('👨‍🎓 Students response:', studentsResponse);
      console.log('👨‍👩‍👧‍👦 Parents response:', parentsResponse);
      
      // Handle students
      if (studentsResponse.success) {
        const studentsData = studentsResponse.data || [];
        console.log('✅ Students loaded:', studentsData);
        setStudents(studentsData);
        
        // Auto-select first student if available
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0]);
        }
      } else {
        console.error('❌ Failed to fetch students:', studentsResponse.message);
        setStudents([]);
      }

      // Handle parents
      if (parentsResponse.success) {
        const parentsData = parentsResponse.data || [];
        console.log('✅ Parents loaded:', parentsData);
        setParents(parentsData);
      } else {
        console.error('❌ Failed to fetch parents:', parentsResponse.message);
        setParents([]);
      }

    } catch (error) {
      console.error('❌ Error fetching teacher messages data:', error);
      toast.error('Failed to load data');
      setStudents([]);
      setParents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <DashboardNavbar userRole="teacher" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <DashboardNavbar userRole="teacher" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">
            Communicate with parents in real-time about their children
          </p>
        </div>

        {/* Student Selection */}
        {students.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Select Student to Discuss
            </h3>
            <div className="flex flex-wrap gap-2">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedStudent?.id === student.id
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {student.firstName} {student.lastName}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* No students message */}
        {students.length === 0 && (
          <Card className="p-8 text-center">
            <UserIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-600">
              No students are assigned to your classes yet.
            </p>
          </Card>
        )}

        {/* Real-Time Messaging Component */}
        {selectedStudent && parents.length > 0 && (
          <RealTimeMessaging 
            teachers={parents} // In teacher context, we're messaging parents
            selectedChild={selectedStudent} // Selected student for context
            user={user}
            isTeacher={true}
          />
        )}

        {/* No parents message */}
        {selectedStudent && parents.length === 0 && (
          <Card className="p-8 text-center">
            <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Parents Available
            </h3>
            <p className="text-gray-600">
              No parents are currently available for messaging.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherMessages;
