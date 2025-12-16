import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Shield, 
  Users, 
  LogOut,
  LayoutDashboard,
  BarChart3,
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * System & Reports Page
 * System monitoring and analytics dashboard
 */
function Reports() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('reports');

  const adminUser = { name: 'Administrator', email: 'admin@tinylearn.com' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // System health metrics
  const systemMetrics = [
    {
      title: 'Server Status',
      value: 'Operational',
      status: 'healthy',
      icon: Server,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      detail: 'Uptime: 99.9%'
    },
    {
      title: 'Database Health',
      value: 'Excellent',
      status: 'healthy',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      detail: 'Response: 12ms'
    },
    {
      title: 'CPU Usage',
      value: '34%',
      status: 'normal',
      icon: Cpu,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      detail: '8 cores active'
    },
    {
      title: 'Memory Usage',
      value: '6.2/16 GB',
      status: 'normal',
      icon: HardDrive,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      detail: '39% utilized'
    },
    {
      title: 'API Response',
      value: '124ms',
      status: 'excellent',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      detail: '-12ms from avg'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      status: 'normal',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      detail: '+8% from yesterday'
    }
  ];

  // Performance logs
  const performanceLogs = [
    { time: '2 mins ago', type: 'success', message: 'Database backup completed successfully', duration: '2.3s' },
    { time: '15 mins ago', type: 'info', message: 'API cache refreshed', duration: '0.8s' },
    { time: '1 hour ago', type: 'warning', message: 'High memory usage detected - Auto-scaled', duration: '5.2s' },
    { time: '2 hours ago', type: 'success', message: 'Server health check passed', duration: '1.1s' },
    { time: '3 hours ago', type: 'info', message: 'Log rotation completed', duration: '3.5s' },
    { time: '4 hours ago', type: 'success', message: 'SSL certificate renewed', duration: '0.5s' },
    { time: '5 hours ago', type: 'info', message: 'Security scan completed', duration: '12.7s' }
  ];

  // Usage statistics
  const usageStats = [
    { label: 'Total API Calls Today', value: '45,678', change: '+12.5%', trend: 'up' },
    { label: 'Average Load Time', value: '1.2s', change: '-0.3s', trend: 'up' },
    { label: 'Error Rate', value: '0.02%', change: '-0.01%', trend: 'up' },
    { label: 'Peak Concurrent Users', value: '892', change: '+45', trend: 'up' },
    { label: 'Data Transferred', value: '12.4 GB', change: '+2.1 GB', trend: 'up' },
    { label: 'Cache Hit Rate', value: '94.2%', change: '+1.8%', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    TinyLearn
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md">
                      ADMIN
                    </span>
                  </h1>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setActiveNav('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/teachers"
                  onClick={() => setActiveNav('teachers')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'teachers'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Teachers
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setActiveNav('reports')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'reports'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  System & Reports
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">Admin</p>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">System & Reports</h2>
            <p className="text-lg text-gray-600">Monitor system health and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* System Health Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
                  </div>
                  {metric.status === 'healthy' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {metric.status === 'normal' && (
                    <Activity className="w-5 h-5 text-blue-500" />
                  )}
                  {metric.status === 'excellent' && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-3xl font-black text-gray-900 mb-2">{metric.value}</p>
                <p className="text-xs text-gray-500 font-medium">{metric.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Logs */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  Performance Logs
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {performanceLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.type === 'success' ? 'bg-green-100' :
                      log.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {log.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {log.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                      {log.type === 'info' && <Activity className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{log.message}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-500">{log.time}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-indigo-600 font-semibold">{log.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {usageStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{stat.label}</p>
                      <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                      <p className={`text-xs font-semibold mt-1 ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview Card */}
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-2xl font-black text-gray-900">Quick System Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-black text-gray-900">All Clear</p>
                    <p className="text-sm text-gray-600">System Status</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">All systems operational with no critical issues detected.</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-black text-gray-900">Optimized</p>
                    <p className="text-sm text-gray-600">Performance</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">System performance is above average with excellent response times.</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-black text-gray-900">1,234</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">Current user activity is within normal operating parameters.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
