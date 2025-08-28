import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalLessons: 0,
      totalAssignments: 0,
      pendingReviews: 0,
      unreadMessages: 0
    },
    lessons: [],
    assignments: [],
    students: [],
    messages: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        lessonsRes, 
        assignmentsRes, 
        usersRes, 
        messagesRes
      ] = await Promise.all([
        api.getLessons(),
        api.getAssignments(),
        api.getUsers(),
        api.getMessages()
      ]);

      const lessons = lessonsRes.success ? lessonsRes.data.lessons || [] : [];
      const assignments = assignmentsRes.success ? assignmentsRes.data.assignments || [] : [];
      const allUsers = usersRes.success ? usersRes.data.users || [] : [];
      const messages = messagesRes.success ? messagesRes.data.messages || [] : [];

      // Filter students only
      const students = allUsers.filter(u => u.role === 'student');
      
      // Calculate stats
      const totalStudents = students.length;
      const totalLessons = lessons.length;
      const totalAssignments = assignments.length;
      const pendingReviews = assignments.filter(a => !a.isGraded).length;
      const unreadMessages = messages.filter(m => !m.isRead).length;

      // Generate recent activity (mock data based on real data structure)
      const recentActivity = [
        ...students.slice(0, 3).map((student, index) => ({
          id: `student-${student.id}`,
          student: `${student.firstName} ${student.lastName}`,
          action: ['Completed Math Quiz', 'Submitted Reading Assignment', 'Started Science Lesson'][index % 3],
          score: [95, 88, null][index % 3],
          time: ['10 minutes ago', '2 hours ago', '3 hours ago'][index % 3],
          type: 'completion'
        })),
        ...assignments.slice(0, 2).map((assignment, index) => ({
          id: `assignment-${assignment.id}`,
          student: 'Various Students',
          action: `New submissions for "${assignment.title}"`,
          score: null,
          time: ['1 hour ago', '4 hours ago'][index % 2],
          type: 'submission'
        }))
      ].slice(0, 5);

      setDashboardData({
        stats: {
          totalStudents,
          totalLessons,
          totalAssignments,
          pendingReviews,
          unreadMessages
        },
        lessons: lessons.slice(0, 6), // Show recent 6 lessons
        assignments: assignments.slice(0, 5), // Show recent 5 assignments
        students: students.slice(0, 8), // Show 8 students for overview
        messages: messages.slice(0, 5), // Show recent 5 messages
        recentActivity
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const createLesson = () => {
    navigate('/teacher/lessons/create');
  };

  const createAssignment = () => {
    navigate('/teacher/assignments/create');
  };

  const viewLesson = (lessonId) => {
    navigate(`/teacher/lessons/${lessonId}`);
  };

  const editLesson = (lessonId) => {
    navigate(`/teacher/lessons/${lessonId}/edit`);
  };

  const deleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const response = await api.deleteLesson(lessonId);
        if (response.success) {
          toast.success('Lesson deleted successfully');
          fetchDashboardData(); // Refresh data
        } else {
          toast.error('Failed to delete lesson');
        }
      } catch (err) {
        console.error('Failed to delete lesson:', err);
        toast.error('Failed to delete lesson');
      }
    }
  };

  const viewAssignment = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}`);
  };

  const gradeAssignment = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}/grade`);
  };

  const viewStudent = (studentId) => {
    navigate(`/teacher/students/${studentId}`);
  };

  const sendMessage = () => {
    navigate('/teacher/messages');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBg = (progress) => {
    if (progress >= 90) return 'bg-green-100';
    if (progress >= 70) return 'bg-blue-100';
    if (progress >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardNavbar role="teacher" currentPage="Dashboard" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardNavbar role="teacher" currentPage="Dashboard" />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {getGreeting()}, {user?.firstName || 'Teacher'}! 👩‍🏫
                  </h1>
                  <p className="text-indigo-100 text-lg">Ready to inspire young minds today?</p>
                </div>
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-12 w-12" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.totalStudents}</div>
                  <div className="text-indigo-100">Total Students</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.totalLessons}</div>
                  <div className="text-indigo-100">Lessons Created</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.pendingReviews}</div>
                  <div className="text-indigo-100">Pending Reviews</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.unreadMessages}</div>
                  <div className="text-indigo-100">New Messages</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              onClick={createLesson}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Create Lesson</h3>
                  <p className="text-sm text-gray-600">Design new learning content</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              onClick={createAssignment}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Create Assignment</h3>
                  <p className="text-sm text-gray-600">Set homework and tasks</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              onClick={sendMessage}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Send Message</h3>
                  <p className="text-sm text-gray-600">Contact parents</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
              onClick={() => toast.success('Opening calendar...', { icon: '📅' })}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Schedule Meeting</h3>
                  <p className="text-sm text-gray-600">Plan conferences</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lessons and Assignments */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Lessons Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  My Lessons
                </h2>
                <div className="flex gap-2">
                  <Button onClick={() => navigate('/teacher/lessons')} variant="outline" size="sm">
                    View All
                  </Button>
                  <Button onClick={createLesson} size="sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Lesson
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.lessons.length > 0 ? (
                  dashboardData.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <ClockIcon className="h-4 w-4" />
                            <span>{lesson.duration} minutes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => viewLesson(lesson.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View lesson"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => editLesson(lesson.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit lesson"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteLesson(lesson.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete lesson"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Subject: {lesson.subject || 'General'}
                        </span>
                        <span className="text-green-600 font-medium">
                          {lesson.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No lessons created yet</p>
                    <Button onClick={createLesson} variant="outline">
                      Create Your First Lesson
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Assignments Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  Recent Assignments
                </h2>
                <div className="flex gap-2">
                  <Button onClick={() => navigate('/teacher/assignments')} variant="outline" size="sm">
                    View All
                  </Button>
                  <Button onClick={createAssignment} variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {dashboardData.assignments.length > 0 ? (
                  dashboardData.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{assignment.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assignment.isGraded
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.isGraded ? 'Graded' : 'Needs Review'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => viewAssignment(assignment.id)}
                            variant="outline"
                            size="sm"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {!assignment.isGraded && (
                            <Button
                              onClick={() => gradeAssignment(assignment.id)}
                              size="sm"
                            >
                              Grade
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No assignments created yet</p>
                    <Button onClick={createAssignment} variant="outline">
                      Create Your First Assignment
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* My Students */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5 text-blue-600" />
                  My Students
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{dashboardData.stats.totalStudents} total</span>
                  <Button onClick={() => navigate('/teacher/students')} variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dashboardData.students.length > 0 ? (
                  dashboardData.students.map((student) => {
                    // Generate mock progress for display
                    const progress = Math.floor(Math.random() * 40) + 60; // 60-100%
                    return (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => viewStudent(student.id)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Grade {student.grade || 'N/A'} • {progress}% complete
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getProgressBg(progress)} ${getProgressColor(progress)}`}>
                          {progress >= 90 ? '⭐' : progress >= 70 ? '👍' : '📈'}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <UserGroupIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No students assigned yet</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                {dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {activity.type === 'completion' ? (
                          <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">
                          {activity.student}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.action}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.time}</span>
                          {activity.score && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {activity.score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Messages */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-purple-600" />
                  Recent Messages
                </h3>
                {dashboardData.stats.unreadMessages > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {dashboardData.stats.unreadMessages} new
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                {dashboardData.messages.length > 0 ? (
                  dashboardData.messages.slice(0, 3).map((message) => (
                    <div key={message.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">
                            {message.senderName || 'Parent'}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {message.content || message.subject}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Recently'}
                          </div>
                        </div>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <EnvelopeIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No messages yet</p>
                  </div>
                )}
                
                {dashboardData.messages.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => navigate('/teacher/messages')}
                  >
                    View All Messages
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
