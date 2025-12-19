import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Users, FileText, MessageCircle, LogOut, Upload, ClipboardCheck, TrendingUp, Bell } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Teacher Dashboard Component
 * Overview dashboard for teachers
 */
function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');

  const teacherUser = { name: 'Sarah Johnson', subject: 'Mathematics' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Overview stats
  const stats = [
    {
      title: 'Total Students',
      value: '124',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Across 6 classes'
    },
    {
      title: 'Linked Parents',
      value: '98',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: '79% connected'
    },
    {
      title: 'Learning Modules',
      value: '45',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: '12 active this week'
    },
    {
      title: 'Active Assignments',
      value: '18',
      icon: ClipboardCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: '5 due this week'
    }
  ];

  // Quick actions
  const quickActions = [
    { title: 'Create Assignment', icon: ClipboardCheck, path: '/teacher/materials', color: 'from-orange-500 to-orange-600' },
    { title: 'Upload Module', icon: Upload, path: '/teacher/materials', color: 'from-purple-500 to-purple-600' },
    { title: 'Manage Users', icon: Users, path: '/teacher/users', color: 'from-blue-500 to-blue-600' },
    { title: 'View Messages', icon: MessageCircle, path: '/teacher/messages', color: 'from-green-500 to-green-600' }
  ];

  // Recent activity
  const recentActivity = [
    { type: 'assignment', student: 'John Doe', action: 'Submitted Algebra Quiz', time: '5 mins ago', status: 'success' },
    { type: 'message', student: 'Parent of Jane Smith', action: 'Sent you a message', time: '1 hour ago', status: 'info' },
    { type: 'module', student: 'System', action: 'New module "Trigonometry" uploaded', time: '2 hours ago', status: 'success' },
    { type: 'assignment', student: 'Emily Davis', action: 'Late submission for Geometry', time: '3 hours ago', status: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <Link to="/teacher/dashboard" className="flex items-center gap-3">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900">Teacher Portal</h1>
                  <p className="text-xs text-indigo-600 font-semibold">{teacherUser.subject}</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  onClick={() => setActiveNav('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  onClick={() => setActiveNav('users')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'users'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link
                  to="/teacher/materials"
                  onClick={() => setActiveNav('materials')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'materials'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  onClick={() => setActiveNav('messages')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'messages'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </Link>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {teacherUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{teacherUser.name}</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Welcome back, {teacherUser.name}! 👋
          </h2>
          <p className="text-gray-600 text-lg">Here's what's happening in your classes today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your classroom</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{action.title}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your students and classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'assignment' && <ClipboardCheck className={`w-5 h-5 ${
                      activity.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                    }`} />}
                    {activity.type === 'message' && <MessageCircle className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'module' && <BookOpen className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.student}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
