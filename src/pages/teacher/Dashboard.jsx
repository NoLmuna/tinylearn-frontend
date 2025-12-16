import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Users, ClipboardCheck, TrendingUp, MessageCircle, Bell, Calendar, FileText, Settings, LogOut, Award } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Teacher Dashboard Component
 * Dashboard for teachers to manage their classes and students
 */
function Dashboard() {
  const navigate = useNavigate();
  const teacherUser = { name: 'Teacher User', subject: 'Mathematics' }; // Mock data

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Mock data for teacher dashboard
  const stats = [
    {
      title: 'Total Students',
      value: '124',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      trend: '+8 this month'
    },
    {
      title: 'Active Classes',
      value: '6',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
      trend: '3 today'
    },
    {
      title: 'Pending Assignments',
      value: '18',
      icon: ClipboardCheck,
      color: 'bg-orange-100 text-orange-600',
      trend: '5 due today'
    },
    {
      title: 'Avg. Performance',
      value: '87%',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      trend: '+3% from last week'
    }
  ];

  const todayClasses = [
    { time: '09:00 AM', class: 'Grade 5A - Mathematics', students: 28, status: 'upcoming' },
    { time: '11:00 AM', class: 'Grade 5B - Mathematics', students: 25, status: 'upcoming' },
    { time: '02:00 PM', class: 'Grade 6A - Advanced Math', students: 22, status: 'upcoming' }
  ];

  const recentSubmissions = [
    { student: 'Sarah Johnson', assignment: 'Algebra Quiz 5', score: 95, time: '10 mins ago' },
    { student: 'Michael Chen', assignment: 'Geometry Homework', score: 88, time: '25 mins ago' },
    { student: 'Emily Davis', assignment: 'Algebra Quiz 5', score: 92, time: '1 hour ago' },
    { student: 'David Smith', assignment: 'Calculus Problem Set', score: 78, time: '2 hours ago' }
  ];

  const pendingTasks = [
    { task: 'Grade Quiz 5 submissions', count: 18, priority: 'high' },
    { task: 'Prepare lesson plan for Week 12', count: 1, priority: 'medium' },
    { task: 'Parent meeting responses', count: 5, priority: 'medium' },
    { task: 'Update grade records', count: 12, priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-black text-black flex items-center gap-2">
                  Teacher Portal
                  <BookOpen className="w-5 h-5 text-purple-500" />
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">{teacherUser.name}</p>
                <p className="text-xs text-gray-500">{teacherUser.subject}</p>
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
            Welcome back, {teacherUser.name}! 👨‍🏫
          </h2>
          <p className="text-gray-600 text-lg">
            You have 3 classes scheduled for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Classes */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-purple-600">{classItem.time}</span>
                          <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-semibold">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{classItem.class}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <Users className="w-4 h-4 inline mr-1" />
                          {classItem.students} students
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Start Class
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  Grade Submissions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Parents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Attendance Record
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Recent Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{submission.student}</p>
                      <p className="text-sm text-gray-600">{submission.assignment}</p>
                      <p className="text-xs text-gray-500 mt-1">{submission.time}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        submission.score >= 90 ? 'text-green-600' :
                        submission.score >= 80 ? 'text-blue-600' :
                        submission.score >= 70 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {submission.score}
                      </p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-purple-500" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.task}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-xs text-gray-600">{item.count} items</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">→</Button>
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
