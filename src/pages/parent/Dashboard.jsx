import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, BookOpen, TrendingUp, MessageCircle, Bell, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Parent Dashboard Component
 * Dashboard for parents to monitor their children's progress
 */
function Dashboard() {
  const navigate = useNavigate();
  const parentUser = { name: 'Parent User', children: ['John Doe', 'Jane Doe'] }; // Mock data

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Mock data for parent dashboard
  const children = [
    {
      name: 'John Doe',
      grade: '5th Grade',
      progress: 85,
      courses: 6,
      attendance: '95%',
      lastActive: '2 hours ago'
    },
    {
      name: 'Jane Doe',
      grade: '3rd Grade',
      progress: 92,
      courses: 5,
      attendance: '98%',
      lastActive: '5 hours ago'
    }
  ];

  const recentActivity = [
    { child: 'John Doe', activity: 'Completed Math Quiz', time: '2 hours ago', type: 'success' },
    { child: 'Jane Doe', activity: 'Started Science Module', time: '5 hours ago', type: 'info' },
    { child: 'John Doe', activity: 'Teacher message received', time: '1 day ago', type: 'message' },
    { child: 'Jane Doe', activity: 'Achievement unlocked: Reading Star', time: '2 days ago', type: 'achievement' }
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Dec 20, 2025', child: 'Both' },
    { title: 'Math Test - John', date: 'Dec 18, 2025', child: 'John Doe' },
    { title: 'Science Fair - Jane', date: 'Dec 22, 2025', child: 'Jane Doe' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-black text-black flex items-center gap-2">
                  Parent Portal
                  <Users className="w-5 h-5 text-green-500" />
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{parentUser.name}</p>
                <p className="text-xs text-gray-500">Parent Account</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
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
            Welcome, {parentUser.name}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Here's how your children are doing today
          </p>
        </div>

        {/* Children Progress Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {children.map((child, index) => (
            <Card key={index} className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{child.name}</CardTitle>
                    <CardDescription className="text-base">{child.grade}</CardDescription>
                  </div>
                  <div className="text-5xl">👦</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span>Overall Progress</span>
                      <span className="text-green-600">{child.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${child.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{child.courses}</p>
                      <p className="text-xs text-gray-600">Active Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{child.attendance}</p>
                      <p className="text-xs text-gray-600">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Last Active</p>
                      <p className="text-sm font-semibold text-gray-900">{child.lastActive}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-4" variant="outline">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Teachers
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'message' ? 'bg-blue-500' :
                        activity.type === 'achievement' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{activity.child}</p>
                        <p className="text-sm text-gray-700">{activity.activity}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Events */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-lg font-bold text-gray-900 mb-1">{event.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                  <p className="text-xs text-green-600 font-semibold">{event.child}</p>
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
