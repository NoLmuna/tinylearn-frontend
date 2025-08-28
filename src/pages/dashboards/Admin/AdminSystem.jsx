import { useState, useEffect } from 'react';
import { 
  CogIcon, 
  ServerIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import toast from 'react-hot-toast';

export default function AdminSystem() {
  const [systemStatus, setSystemStatus] = useState({
    server: 'online',
    database: 'online',
    storage: 'online',
    lastBackup: '2 hours ago',
    uptime: '99.9%',
    activeUsers: 12,
    memoryUsage: 65,
    diskUsage: 23
  });
  
  const [systemLogs] = useState([
    {
      id: 1,
      type: 'info',
      message: 'System backup completed successfully',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      source: 'Backup Service'
    },
    {
      id: 2,
      type: 'warning',
      message: 'High memory usage detected (85%)',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      source: 'Monitoring'
    },
    {
      id: 3,
      type: 'success',
      message: 'New user registration: John Doe',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      source: 'User Service'
    },
    {
      id: 4,
      type: 'info',
      message: 'Database optimization completed',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      source: 'Database'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 20) + 5,
        memoryUsage: Math.floor(Math.random() * 30) + 50,
        diskUsage: Math.floor(Math.random() * 10) + 20
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshSystemStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setSystemStatus(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 20) + 5,
        memoryUsage: Math.floor(Math.random() * 30) + 50,
        diskUsage: Math.floor(Math.random() * 10) + 20
      }));
      setIsRefreshing(false);
      toast.success('System status refreshed');
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default: return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString();
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardNavbar role="admin" currentPage="System" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-red-700 rounded-full">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
                <p className="text-lg text-gray-600">
                  Monitor and manage your TinyLearn platform
                </p>
              </div>
            </div>
            <Button
              onClick={refreshSystemStatus}
              disabled={isRefreshing}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Server Status', 
              status: systemStatus.server, 
              icon: ServerIcon,
              description: 'Application server'
            },
            { 
              title: 'Database', 
              status: systemStatus.database, 
              icon: CircleStackIcon,
              description: 'MySQL database'
            },
            { 
              title: 'Storage', 
              status: systemStatus.storage, 
              icon: CloudIcon,
              description: 'File storage system'
            },
            { 
              title: 'Security', 
              status: 'online', 
              icon: ShieldCheckIcon,
              description: 'Security monitoring'
            }
          ].map((item, index) => (
            <Card key={index}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <item.icon className="h-8 w-8 text-gray-600" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Metrics */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Metrics</h2>
              
              <div className="space-y-6">
                {/* Uptime */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">System Uptime</span>
                    <span className="text-sm text-gray-600">{systemStatus.uptime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    <span className="text-sm text-gray-600">{systemStatus.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(systemStatus.memoryUsage)}`}
                      style={{ width: `${systemStatus.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Disk Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                    <span className="text-sm text-gray-600">{systemStatus.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getUsageColor(systemStatus.diskUsage)}`}
                      style={{ width: `${systemStatus.diskUsage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Active Users */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Active Users</span>
                    <span className="text-2xl font-bold text-blue-600">{systemStatus.activeUsers}</span>
                  </div>
                </div>

                {/* Last Backup */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Last Backup</span>
                    <span className="text-sm text-gray-600">{systemStatus.lastBackup}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* System Actions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Actions</h2>
              
              <div className="space-y-4">
                <Button
                  onClick={() => toast.success('Backup initiated successfully!')}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CircleStackIcon className="h-5 w-5 mr-3" />
                  Create System Backup
                </Button>
                
                <Button
                  onClick={() => toast.success('Cache cleared successfully!')}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-3" />
                  Clear Cache
                </Button>
                
                <Button
                  onClick={() => toast.success('System optimized successfully!')}
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <CogIcon className="h-5 w-5 mr-3" />
                  Optimize Database
                </Button>
                
                <Button
                  onClick={() => toast('Maintenance mode coming soon!', { icon: 'ℹ️' })}
                  className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <ExclamationTriangleIcon className="h-5 w-5 mr-3" />
                  Maintenance Mode
                </Button>
                
                <Button
                  onClick={() => toast('System restart coming soon!', { icon: 'ℹ️' })}
                  className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-3" />
                  Restart System
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* System Logs */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Logs</h2>
            
            <div className="space-y-4">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  {getLogTypeIcon(log.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Source: {log.source}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                onClick={() => toast('Full logs viewer coming soon!', { icon: 'ℹ️' })}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                View All Logs
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
