import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  HeartIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  CalendarDaysIcon,
  TrophyIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  EyeIcon,
  PlusIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import api from '../../../services/api';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalChildren: 0,
      averageProgress: 0,
      totalMessages: 0,
      upcomingAssignments: 0
    },
    children: [],
    messages: [],
    upcomingEvents: []
  });
  const [selectedChild, setSelectedChild] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ 
    subject: '', 
    content: '', 
    receiverId: '' 
  });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        childrenRes, 
        messagesRes, 
        teachersRes
      ] = await Promise.all([
        api.getParentChildren(),
        api.getMessages(),
        api.getContacts()
      ]);

      const children = childrenRes.success ? childrenRes.data.children || [] : [];
      const messages = messagesRes.success ? messagesRes.data.messages || [] : [];
      const allTeachers = teachersRes.success ? teachersRes.data || [] : [];
      
      // Filter teachers only
      const teacherContacts = allTeachers.filter(contact => contact.role === 'teacher');
      setTeachers(teacherContacts);

      // Set selected child to first child
      if (children.length > 0 && !selectedChild) {
        setSelectedChild(children[0]);
      }

      // Calculate stats
      const totalChildren = children.length;
      const averageProgress = children.length > 0 
        ? Math.round(children.reduce((sum, child) => sum + child.recentProgress.averageScore, 0) / children.length)
        : 0;
      const totalMessages = messages.length;
      const upcomingAssignments = children.reduce((sum, child) => sum + (child.upcomingAssignments?.length || 0), 0);

      // Generate mock upcoming events
      const upcomingEvents = [
        {
          id: 1,
          title: 'Parent-Teacher Conference',
          date: '2025-09-05',
          time: '3:00 PM',
          type: 'meeting',
          childName: children[0]?.firstName || 'Child'
        },
        {
          id: 2,
          title: 'Math Assessment Due',
          date: '2025-09-03',
          time: 'All Day',
          type: 'assignment',
          childName: children[0]?.firstName || 'Child'
        }
      ];

      setDashboardData({
        stats: {
          totalChildren,
          averageProgress,
          totalMessages,
          upcomingAssignments
        },
        children,
        messages: messages.slice(0, 5),
        upcomingEvents
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!newMessage.receiverId || !newMessage.subject || !newMessage.content) {
        toast.error('Please fill in all fields');
        return;
      }

      const messageData = {
        ...newMessage,
        messageType: 'general',
        priority: 'medium',
        relatedStudentId: selectedChild?.id
      };

      const response = await api.sendMessage(messageData);
      if (response.success) {
        setShowMessageModal(false);
        setNewMessage({ subject: '', content: '', receiverId: '' });
        toast.success('Message sent successfully!');
        fetchDashboardData();
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const viewChildProgress = (child) => {
    toast.success(`Opening ${child.firstName}'s detailed progress...`, { icon: '📊' });
    console.log('Viewing progress for child:', child);
  };

  const scheduleConference = () => {
    toast.success('Opening conference scheduler...', { icon: '📅' });
    console.log('Schedule conference');
  };

  const viewReports = () => {
    toast.success('Opening detailed reports...', { icon: '📈' });
    console.log('View reports');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getProgressColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <DashboardNavbar role="parent" currentPage="Dashboard" />
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <DashboardNavbar role="parent" currentPage="Dashboard" />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {getGreeting()}, {user?.firstName || 'Parent'}! 👨‍👩‍👧‍👦
                  </h1>
                  <p className="text-purple-100 text-lg">Track your child's learning journey</p>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="h-12 w-12" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.totalChildren}</div>
                  <div className="text-purple-100">Children</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.averageProgress}%</div>
                  <div className="text-purple-100">Avg Progress</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.upcomingAssignments}</div>
                  <div className="text-purple-100">Assignments Due</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">{dashboardData.stats.totalMessages}</div>
                  <div className="text-purple-100">Messages</div>
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
              onClick={() => setShowMessageModal(true)}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Message Teacher</h3>
                  <p className="text-sm text-gray-600">Contact your child's teacher</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              onClick={scheduleConference}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Schedule Meeting</h3>
                  <p className="text-sm text-gray-600">Book parent-teacher conference</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              onClick={viewReports}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">View Reports</h3>
                  <p className="text-sm text-gray-600">Detailed progress reports</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
              onClick={() => selectedChild && viewChildProgress(selectedChild)}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <TrophyIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">View Achievements</h3>
                  <p className="text-sm text-gray-600">See learning milestones</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Children Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Children Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                  My Children
                </h2>
              </div>
              
              {dashboardData.children.length > 0 ? (
                dashboardData.children.map((child) => (
                  <div
                    key={child.id}
                    className="mb-6 p-6 rounded-xl border-2 border-gray-200 bg-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {child.firstName?.charAt(0)}{child.lastName?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
                          <p className="text-gray-600">Age {child.age} • {child.grade}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircleIcon className="h-4 w-4" />
                              <span>{child.recentProgress.lessonsCompleted} lessons completed</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <ClockIcon className="h-4 w-4" />
                              <span>{child.recentProgress.timeSpent}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getProgressColor(child.recentProgress.averageScore)}`}>
                          {child.recentProgress.averageScore}%
                        </div>
                        <div className="text-sm text-gray-500">Average Score</div>
                        {child.recentProgress.streak > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-orange-600">
                            <StarIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">{child.recentProgress.streak} day streak!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Recent Activities</h4>
                      <div className="space-y-2">
                        {child.recentActivities && child.recentActivities.length > 0 ? (
                          child.recentActivities.slice(0, 3).map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getProgressBg(activity.score)}`}>
                                  <BookOpenIcon className={`h-4 w-4 ${getProgressColor(activity.score)}`} />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">{activity.lesson}</div>
                                  <div className="text-sm text-gray-500 capitalize">{activity.category}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold ${getProgressColor(activity.score)}`}>
                                  {activity.score}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(activity.date)}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No recent activities
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button 
                        onClick={() => viewChildProgress(child)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Detailed Progress
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Children Found</h3>
                  <p className="text-gray-500 mb-4">You don't have any children linked to your account.</p>
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                Upcoming Events
              </h3>
              
              <div className="space-y-3">
                {dashboardData.upcomingEvents.length > 0 ? (
                  dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{event.title}</div>
                          <div className="text-sm text-gray-600">For {event.childName}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formatDate(event.date)} • {event.time}
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                          event.type === 'meeting' ? 'bg-blue-500' :
                          event.type === 'assignment' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <CalendarDaysIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No upcoming events</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Messages */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                  Recent Messages
                </h3>
                <Button
                  onClick={() => setShowMessageModal(true)}
                  size="sm"
                  variant="outline"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              
              <div className="space-y-3">
                {dashboardData.messages.length > 0 ? (
                  dashboardData.messages.slice(0, 3).map((message) => (
                    <div key={message.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">
                            {message.senderName || 'Teacher'}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {message.subject || message.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {message.createdAt ? formatDate(message.createdAt) : 'Recently'}
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
                    onClick={() => toast.success('Opening all messages...', { icon: '📬' })}
                  >
                    View All Messages
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Send Message</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To (Teacher)
                </label>
                <select
                  value={newMessage.receiverId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, receiverId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a teacher</option>
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
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter subject..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
              </div>
              
              {selectedChild && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-700">
                    <strong>Regarding:</strong> {selectedChild.firstName} {selectedChild.lastName}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowMessageModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={sendMessage}
                className="flex-1"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
