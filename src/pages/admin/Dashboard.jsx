import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Shield, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  BarChart3, 
  FileText, 
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Admin Dashboard Component
 * Administrative control panel and overview
 */
function Dashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState({ name: 'Administrator' }); // Mock admin user
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication check removed for front-end preview
  // useEffect(() => {
  //   const token = localStorage.getItem('adminToken');
  //   const user = localStorage.getItem('adminUser');
  //   const role = localStorage.getItem('userRole');

  //   if (!token || role !== 'admin') {
  //     navigate('/admin/login');
  //     return;
  //   }

  //   if (user) {
  //     setAdminUser(JSON.parse(user));
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };

  // Dashboard stats (mock data - will be replaced with real API calls)
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Tutors',
      value: '56',
      icon: GraduationCap,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      change: '+5%'
    },
    {
      title: 'Total Courses',
      value: '128',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      change: '+8%'
    },
    {
      title: 'Active Sessions',
      value: '45',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      change: '+18%'
    }
  ];

  // Quick actions
  const quickActions = [
    { title: 'Manage Students', icon: Users, path: '/admin/students', color: 'bg-blue-500' },
    { title: 'Manage Tutors', icon: GraduationCap, path: '/admin/tutors', color: 'bg-green-500' },
    { title: 'Course Management', icon: BookOpen, path: '/admin/courses', color: 'bg-purple-500' },
    { title: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports', color: 'bg-orange-500' },
    { title: 'System Settings', icon: Settings, path: '/admin/settings', color: 'bg-gray-500' },
    { title: 'Notifications', icon: Bell, path: '/admin/notifications', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div>
                  <h1 className="text-xl font-black text-black flex items-center gap-2">
                    TinyLearn Admin
                    <Shield className="w-5 h-5 text-[#F4C21A]" />
                  </h1>
                </div>
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-xs text-gray-500">Admin Account</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Welcome back, {adminUser?.name || 'Administrator'}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your learning platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-xl shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 text-center">
                    {action.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & System Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F4C21A]" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New student registration', time: '5 minutes ago', type: 'success' },
                  { action: 'Course content updated', time: '1 hour ago', type: 'info' },
                  { action: 'Tutor profile verified', time: '2 hours ago', type: 'success' },
                  { action: 'System maintenance scheduled', time: '3 hours ago', type: 'warning' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#F4C21A]" />
                System Status
              </CardTitle>
              <CardDescription>Platform health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Server Status', status: 'Operational', color: 'green' },
                  { label: 'Database', status: 'Healthy', color: 'green' },
                  { label: 'API Response Time', status: '45ms', color: 'green' },
                  { label: 'Storage Usage', status: '67%', color: 'yellow' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className={`text-sm font-semibold ${
                      item.color === 'green' ? 'text-green-600' :
                      item.color === 'yellow' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
