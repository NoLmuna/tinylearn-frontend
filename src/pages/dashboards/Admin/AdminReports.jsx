import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import DashboardNavbar from '../../../components/ui/DashboardNavbar';
import toast from 'react-hot-toast';

export default function AdminReports() {
  const [reportData] = useState({
    userRegistrations: [
      { month: 'Jan', students: 12, teachers: 3, parents: 8 },
      { month: 'Feb', students: 18, teachers: 2, parents: 15 },
      { month: 'Mar', students: 25, teachers: 4, parents: 20 },
      { month: 'Apr', students: 32, teachers: 6, parents: 28 },
      { month: 'May', students: 28, teachers: 5, parents: 25 },
      { month: 'Jun', students: 35, teachers: 7, parents: 30 }
    ],
    platformUsage: {
      dailyActiveUsers: 245,
      weeklyActiveUsers: 1250,
      monthlyActiveUsers: 3200,
      averageSessionTime: '25 min',
      totalLessonsCompleted: 1850,
      assignmentsSubmitted: 420
    },
    popularContent: [
      { title: 'Introduction to Mathematics', views: 1250, completion: 85 },
      { title: 'Basic English Grammar', views: 980, completion: 78 },
      { title: 'Science Fundamentals', views: 875, completion: 82 },
      { title: 'History Basics', views: 720, completion: 75 },
      { title: 'Geography Essentials', views: 650, completion: 70 }
    ]
  });

  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate data fetching based on selected period
    const fetchReportData = () => {
      // In a real app, this would fetch data from your API
      console.log('Fetching report data for period:', selectedPeriod);
    };
    
    fetchReportData();
  }, [selectedPeriod]);

  const generateReport = async (reportType) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`${reportType} report generated successfully!`);
    }, 2000);
  };

  const downloadReport = (reportType) => {
    toast.success(`Downloading ${reportType} report...`);
    // In a real app, this would trigger a file download
  };

  const reportTypes = [
    {
      title: 'User Activity Report',
      description: 'Detailed analysis of user engagement and platform usage',
      icon: UserGroupIcon,
      color: 'blue',
      metrics: ['Active Users', 'Session Duration', 'Feature Usage']
    },
    {
      title: 'Academic Performance',
      description: 'Student progress, lesson completion rates, and assessment results',
      icon: AcademicCapIcon,
      color: 'green',
      metrics: ['Completion Rates', 'Assessment Scores', 'Progress Tracking']
    },
    {
      title: 'Content Analytics',
      description: 'Popular lessons, engagement metrics, and content effectiveness',
      icon: DocumentTextIcon,
      color: 'purple',
      metrics: ['View Counts', 'Engagement Time', 'Completion Rates']
    },
    {
      title: 'System Performance',
      description: 'Server performance, response times, and system health metrics',
      icon: ChartBarIcon,
      color: 'orange',
      metrics: ['Response Time', 'Uptime', 'Error Rates']
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardNavbar role="admin" currentPage="Reports" />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-700 rounded-full">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-lg text-gray-600">
                  Generate comprehensive reports and view platform analytics
                </p>
              </div>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 3 Months</option>
                <option value="365days">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Daily Active Users', 
              value: reportData.platformUsage.dailyActiveUsers, 
              icon: UserGroupIcon,
              change: '+12%',
              color: 'blue'
            },
            { 
              title: 'Lessons Completed', 
              value: reportData.platformUsage.totalLessonsCompleted, 
              icon: AcademicCapIcon,
              change: '+8%',
              color: 'green'
            },
            { 
              title: 'Avg Session Time', 
              value: reportData.platformUsage.averageSessionTime, 
              icon: ClockIcon,
              change: '+5%',
              color: 'purple'
            },
            { 
              title: 'Assignments Submitted', 
              value: reportData.platformUsage.assignmentsSubmitted, 
              icon: DocumentTextIcon,
              change: '+15%',
              color: 'orange'
            }
          ].map((stat, index) => (
            <Card key={index}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Report Generation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {reportTypes.map((report, index) => (
            <Card key={index}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-gradient-to-br ${getColorClasses(report.color)} rounded-lg`}>
                      <report.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Included Metrics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.metrics.map((metric, metricIndex) => (
                      <span
                        key={metricIndex}
                        className={`px-2 py-1 bg-${report.color}-100 text-${report.color}-800 text-xs rounded-full`}
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => generateReport(report.title)}
                    disabled={isGenerating}
                    className={`flex-1 bg-gradient-to-r ${getColorClasses(report.color)} text-white`}
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                  <Button
                    onClick={() => downloadReport(report.title)}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Popular Content */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Popular Content</h2>
              <Button
                onClick={() => toast('Detailed content analytics coming soon!', { icon: 'ℹ️' })}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.popularContent.map((content, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-8 w-8 text-blue-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{content.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {content.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {content.completion}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              content.completion >= 80 ? 'bg-green-500' :
                              content.completion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${content.completion}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
