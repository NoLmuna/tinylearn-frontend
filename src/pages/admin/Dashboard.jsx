import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Shield, 
  Users, 
  BookOpen, 
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  LogOut,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Admin Dashboard Component
 * Modern administrative control panel with clean UI/UX
 */
function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const adminUser = { name: 'Administrator', email: 'admin@tinylearn.com' }; // Mock data

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // System Overview Analytics
  const systemStats = [
    {
      title: 'Total Teachers',
      value: '42',
      change: '+8 this month',
      trend: 'up',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Active Classes',
      value: '156',
      change: '12 today',
      trend: 'up',
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'System Health',
      value: '98.5%',
      change: 'All systems operational',
      trend: 'stable',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Avg. Response Time',
      value: '124ms',
      change: '-12ms from last week',
      trend: 'up',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  // Recent Teachers (mock data)
  const teachers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@tinylearn.com', subject: 'Mathematics', classes: 8, status: 'active' },
    { id: 2, name: 'Michael Chen', email: 'michael.c@tinylearn.com', subject: 'Science', classes: 6, status: 'active' },
    { id: 3, name: 'Emily Davis', email: 'emily.d@tinylearn.com', subject: 'English', classes: 7, status: 'active' },
    { id: 4, name: 'James Wilson', email: 'james.w@tinylearn.com', subject: 'History', classes: 5, status: 'active' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa.a@tinylearn.com', subject: 'Art', classes: 4, status: 'active' }
  ];

  // System Activity Log
  const activityLog = [
    { id: 1, type: 'success', message: 'New teacher account created: John Smith', time: '5 mins ago' },
    { id: 2, type: 'info', message: 'Class schedule updated by Sarah Johnson', time: '23 mins ago' },
    { id: 3, type: 'warning', message: 'High server load detected - Auto-scaled', time: '1 hour ago' },
    { id: 4, type: 'success', message: 'Database backup completed successfully', time: '2 hours ago' },
    { id: 5, type: 'info', message: 'System maintenance scheduled for tonight', time: '3 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <img src={logo} alt="TinyLearn" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  TinyLearn
                  <span className="text-sm font-semibold px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                    ADMIN
                  </span>
                </h1>
                <p className="text-xs text-gray-500 font-medium">Administrative Portal</p>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Dashboard Overview
          </h2>
          <p className="text-lg text-gray-600">
            Monitor system performance and manage teachers
          </p>
        </div>

        {/* System Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {stat.trend === 'up' && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Teacher Management Section */}
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Teacher Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Create and manage teacher accounts</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Teacher
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers by name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Teachers Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Subject</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Classes</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {teacher.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{teacher.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          {teacher.subject}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">{teacher.classes}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Activity Monitor */}
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              System Activity Monitor
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Real-time system behavior and events</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-100' :
                    activity.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {activity.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                    {activity.type === 'info' && <Activity className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Teacher Modal (Simple placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-2xl font-black text-gray-900">Create New Teacher</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Add a new teacher to the system</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="teacher@tinylearn.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  Create Teacher
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
