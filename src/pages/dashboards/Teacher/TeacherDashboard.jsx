import { useState, useEffect } from 'react';
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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import api from '../../../services/api';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 24,
    totalLessons: 12,
    completedAssignments: 89,
    pendingReviews: 7
  });

  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageStats, setMessageStats] = useState({ unreadCount: 0 });

  const [recentActivities] = useState([
    { id: 1, student: 'Emma Davis', action: 'Completed Math Quiz', score: 95, time: '10 minutes ago' },
    { id: 2, student: 'Liam Chen', action: 'Submitted Reading Assignment', score: 88, time: '2 hours ago' },
    { id: 3, student: 'Sophia Rodriguez', action: 'Started Science Lesson', score: null, time: '3 hours ago' },
    { id: 4, student: 'Noah Johnson', action: 'Completed Art Project', score: 92, time: '1 day ago' }
  ]);

  const [myStudents] = useState([
    { id: 1, name: 'Emma Davis', grade: '2nd Grade', lastActivity: '2 hours ago', progress: 85, status: 'active' },
    { id: 2, name: 'Liam Chen', grade: '2nd Grade', lastActivity: '1 day ago', progress: 92, status: 'active' },
    { id: 3, name: 'Sophia Rodriguez', grade: '2nd Grade', lastActivity: '3 hours ago', progress: 78, status: 'needs_attention' },
    { id: 4, name: 'Noah Johnson', grade: '2nd Grade', lastActivity: '5 hours ago', progress: 88, status: 'active' },
    { id: 5, name: 'Olivia Smith', grade: '2nd Grade', lastActivity: '1 hour ago', progress: 95, status: 'excellent' }
  ]);

  const [upcomingClasses] = useState([
    { id: 1, subject: 'Math', time: '2:00 PM', students: 12, topic: 'Addition & Subtraction' },
    { id: 2, subject: 'Reading', time: '3:30 PM', students: 8, topic: 'Story Comprehension' },
    { id: 3, subject: 'Science', time: 'Tomorrow 10AM', students: 15, topic: 'Plant Life Cycle' }
  ]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          loadAssignments(),
          loadMessages(),
          loadMessageStats()
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await api.getTeacherAssignments({ limit: 5 });
      if (response.success) {
        setAssignments(response.data.assignments || []);
        // Update stats with real data
        const pendingReviews = response.data.assignments?.reduce((count, assignment) => {
          return count + (assignment.submissionStats?.pending || 0);
        }, 0) || 0;
        setStats(prev => ({ ...prev, pendingReviews }));
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.getReceivedMessages({ limit: 5 });
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadMessageStats = async () => {
    try {
      const response = await api.getMessageStats();
      if (response.success) {
        setMessageStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load message stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Create Assignment',
      description: 'Create homework and tasks for students',
      icon: DocumentTextIcon,
      action: () => console.log('Create assignment'),
      color: 'blue'
    },
    {
      title: 'Create New Lesson',
      description: 'Design interactive lessons for your students',
      icon: PlusIcon,
      action: () => console.log('Create lesson'),
      color: 'green'
    },
    {
      title: 'View Messages',
      description: 'Check parent communications',
      icon: EnvelopeIcon,
      action: () => console.log('View messages'),
      color: 'purple'
    },
    {
      title: 'Schedule Meeting',
      description: 'Set up parent-teacher conferences',
      icon: CalendarDaysIcon,
      action: () => console.log('Schedule meeting'),
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardNavbar role="teacher" currentPage="Dashboard" />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Teacher'}!
              </h1>
              <p className="text-lg text-gray-600">
                Teacher Dashboard - Ready to inspire young minds today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Lessons</p>
                <p className="text-3xl font-bold">{stats.totalLessons}</p>
              </div>
              <BookOpenIcon className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completed Work</p>
                <p className="text-3xl font-bold">{stats.completedAssignments}</p>
              </div>
              <CheckCircleIcon className="h-12 w-12 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold">{stats.pendingReviews}</p>
              </div>
              <ClockIcon className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Common tasks and shortcuts</p>
              </div>
              
              <div className="space-y-4">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:scale-105 ${
                      action.color === 'blue' 
                        ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' 
                        : action.color === 'green'
                        ? 'border-green-300 hover:border-green-500 hover:bg-green-50'
                        : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <action.icon className={`h-8 w-8 ${
                        action.color === 'blue' ? 'text-blue-600' : 
                        action.color === 'green' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Upcoming Classes */}
            <Card className="mt-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upcoming Classes</h2>
                <p className="text-gray-600">Your schedule for today</p>
              </div>
              
              <div className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-900">{classItem.subject}</h3>
                      <span className="text-sm text-blue-600">{classItem.time}</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-1">{classItem.topic}</p>
                    <p className="text-xs text-blue-600">{classItem.students} students enrolled</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Students Overview */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">My Students</h2>
                <p className="text-gray-600">Student progress and activity overview</p>
              </div>
              
              <div className="space-y-4">
                {myStudents.map((student) => (
                  <div key={student.id} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.grade} • Last activity: {student.lastActivity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{student.progress}% Progress</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                student.status === 'excellent' ? 'bg-green-500' :
                                student.status === 'needs_attention' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'excellent' ? 'bg-green-100 text-green-800' :
                          student.status === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {student.status === 'excellent' ? 'Excellent' : 
                           student.status === 'needs_attention' ? 'Needs Attention' : 'Active'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700">
                View All Students
              </Button>
            </Card>
          </div>
        </div>

        {/* Assignments & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Assignments */}
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Assignments</h2>
                <p className="text-gray-600">Manage homework and tasks</p>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => console.log('Create assignment')}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                New Assignment
              </Button>
            </div>
            
            <div className="space-y-4">
              {assignments.length > 0 ? (
                assignments.slice(0, 4).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.submissionStats?.pending > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {assignment.submissionStats?.pending > 0 
                          ? `${assignment.submissionStats.pending} pending` 
                          : 'All reviewed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {assignment.submissionStats?.submitted || 0} / {assignment.submissionStats?.total || 0} submitted
                      </div>
                      {assignment.submissionStats?.pending > 0 && (
                        <div className="flex items-center text-yellow-600">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs">Needs review</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No assignments yet</p>
                  <p className="text-sm text-gray-400">Create your first assignment to get started</p>
                </div>
              )}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              View All Assignments
            </Button>
          </Card>

          {/* Messages */}
          <Card>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Messages</h2>
                <p className="text-gray-600">Parent communications</p>
              </div>
              <div className="flex items-center gap-2">
                {messageStats.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {messageStats.unreadCount} new
                  </span>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => console.log('View all messages')}
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {messages.length > 0 ? (
                messages.slice(0, 4).map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      !message.isRead ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {message.sender.firstName} {message.sender.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{message.subject}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {message.content.substring(0, 60)}...
                    </p>
                    {message.priority === 'urgent' && (
                      <div className="flex items-center mt-2">
                        <ExclamationTriangleIcon className="h-3 w-3 text-red-500 mr-1" />
                        <span className="text-xs text-red-600 font-medium">Urgent</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <EnvelopeIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400">Parents can message you about their children</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <Card>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activities</h2>
              <p className="text-gray-600">Latest student submissions and activities</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Activity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{activity.student}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{activity.action}</td>
                      <td className="py-4 px-4">
                        {activity.score ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.score >= 90 ? 'bg-green-100 text-green-800' :
                            activity.score >= 75 ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.score}%
                          </span>
                        ) : (
                          <span className="text-gray-400">In Progress</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{activity.time}</td>
                      <td className="py-4 px-4">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
