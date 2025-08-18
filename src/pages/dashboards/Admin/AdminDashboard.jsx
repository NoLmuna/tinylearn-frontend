import { useState, useEffect } from 'react';
import { 
  CogIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    // TODO: Fetch real data from API
    setStats({
      totalUsers: 1247,
      activeStudents: 892,
      totalTeachers: 45,
      pendingApprovals: 7,
      totalLessons: 156,
      systemUptime: '99.9%'
    });

    setPendingTeachers([
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        experience: '5 years',
        subject: 'Mathematics',
        appliedDate: '2024-01-15',
        status: 'pending'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@school.edu',
        experience: '3 years',
        subject: 'Science',
        appliedDate: '2024-01-14',
        status: 'pending'
      }
    ]);

    setRecentUsers([
      { id: 1, name: 'Emma Davis', role: 'student', joinedDate: 'Today', status: 'active' },
      { id: 2, name: 'John Smith', role: 'parent', joinedDate: 'Yesterday', status: 'active' },
      { id: 3, name: 'Lisa Brown', role: 'teacher', joinedDate: '2 days ago', status: 'approved' }
    ]);

    setSystemAlerts([
      {
        id: 1,
        type: 'warning',
        title: 'Server Load High',
        message: 'Server CPU usage above 80% for the last hour',
        time: '10 minutes ago'
      },
      {
        id: 2,
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for this weekend',
        time: '2 hours ago'
      }
    ]);
  }, []);

  const handleApproveTeacher = async (teacherId) => {
    try {
      // TODO: API call to approve teacher
      console.log('Approving teacher:', teacherId);
      setPendingTeachers(prev => 
        prev.map(teacher => 
          teacher.id === teacherId 
            ? { ...teacher, status: 'approved' }
            : teacher
        )
      );
    } catch (error) {
      console.error('Failed to approve teacher:', error);
    }
  };

  const handleRejectTeacher = async (teacherId) => {
    try {
      // TODO: API call to reject teacher
      console.log('Rejecting teacher:', teacherId);
      setPendingTeachers(prev => 
        prev.filter(teacher => teacher.id !== teacherId)
      );
    } catch (error) {
      console.error('Failed to reject teacher:', error);
    }
  };

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage all users, roles, and permissions',
      icon: UserGroupIcon,
      action: () => console.log('User management'),
      color: 'blue',
      count: stats.totalUsers
    },
    {
      title: 'Content Management',
      description: 'Manage lessons, courses, and educational content',
      icon: AcademicCapIcon,
      action: () => console.log('Content management'),
      color: 'green',
      count: stats.totalLessons
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed analytics and generate reports',
      icon: ChartBarIcon,
      action: () => console.log('Analytics'),
      color: 'purple',
      count: '24'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: CogIcon,
      action: () => console.log('System settings'),
      color: 'orange',
      count: null
    }
  ];

  const quickStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+12%',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'blue'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents,
      change: '+8%',
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'green'
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers,
      change: '+2',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'purple'
    },
    {
      title: 'System Uptime',
      value: stats.systemUptime,
      change: 'Stable',
      changeType: 'neutral',
      icon: CheckCircleIcon,
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full">
              <CogIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Welcome back, {user?.firstName}! Manage your TinyLearn platform
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-${stat.color}-100 text-sm font-medium`}>{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? `bg-${stat.color}-400 text-${stat.color}-100`
                        : `bg-${stat.color}-300 text-${stat.color}-800`
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <stat.icon className={`h-12 w-12 text-${stat.color}-200`} />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Teacher Approvals */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Pending Teacher Approvals
                  </h2>
                  <p className="text-gray-600">
                    {pendingTeachers.length} teachers waiting for approval
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                    {pendingTeachers.length} Pending
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {pendingTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{teacher.name}</h3>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                        <p className="text-xs text-gray-500">
                          {teacher.subject} • {teacher.experience} experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleApproveTeacher(teacher.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectTeacher(teacher.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingTeachers.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending teacher approvals</p>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Common administrative tasks</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adminActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.action}
                    className={`p-6 rounded-xl border-2 border-gray-200 hover:border-${action.color}-300 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 bg-${action.color}-500 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-${action.color}-900 mb-1`}>
                            {action.title}
                          </h3>
                          <p className={`text-sm text-${action.color}-700`}>
                            {action.description}
                          </p>
                        </div>
                      </div>
                      {action.count && (
                        <div className={`bg-${action.color}-500 text-white text-sm font-bold px-2 py-1 rounded-full`}>
                          {action.count}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* System Alerts */}
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">System Alerts</h2>
                <p className="text-gray-600">Recent system notifications</p>
              </div>
              
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' 
                        ? 'border-yellow-500 bg-yellow-50'
                        : alert.type === 'error'
                        ? 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {alert.type === 'warning' ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : alert.type === 'error' ? (
                        <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${
                          alert.type === 'warning' 
                            ? 'text-yellow-900'
                            : alert.type === 'error'
                            ? 'text-red-900'
                            : 'text-blue-900'
                        }`}>
                          {alert.title}
                        </h3>
                        <p className={`text-sm ${
                          alert.type === 'warning' 
                            ? 'text-yellow-700'
                            : alert.type === 'error'
                            ? 'text-red-700'
                            : 'text-blue-700'
                        }`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Users */}
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Users</h2>
                <p className="text-gray-600">Latest user registrations</p>
              </div>
              
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role} • {user.joinedDate}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'approved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white">
                View All Users
              </Button>
            </Card>

            {/* Quick Add */}
            <Card>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Add</h2>
                <p className="text-gray-600">Create new accounts</p>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-start">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white justify-start">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white justify-start">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Lesson
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
