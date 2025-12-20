import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, BookOpen, MessageCircle, TrendingUp, ChevronRight, Award, Clock, Bell } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Parent Dashboard Component
 * Overview page with summaries of progress, activity, and messages
 */
function Dashboard() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(0);
  
  const parentUser = { name: 'Sarah Johnson', email: 'sarah.j@example.com' };

  // Mock children data - summary only
  const children = [
    {
      id: 1,
      name: 'Emma Johnson',
      grade: '5th Grade',
      avatar: '👧',
      overallProgress: 69,
      activeLessons: 4,
      pendingAssignments: 2,
      completedThisWeek: 3,
      averageScore: 92
    },
    {
      id: 2,
      name: 'Noah Johnson',
      grade: '3rd Grade',
      avatar: '👦',
      overallProgress: 86,
      activeLessons: 3,
      pendingAssignments: 1,
      completedThisWeek: 2,
      averageScore: 96
    }
  ];

  // Mock recent activity
  const recentActivity = [
    { child: 'Emma', activity: 'Completed Math Practice Problems', subject: 'Mathematics', time: '2 hours ago', type: 'success' },
    { child: 'Noah', activity: 'Started Plant Growth Journal', subject: 'Science', time: '5 hours ago', type: 'info' },
    { child: 'Emma', activity: 'New message from Ms. Smith', subject: 'Mathematics', time: '1 day ago', type: 'message' },
    { child: 'Noah', activity: 'Scored 100% on Addition Worksheet', subject: 'Mathematics', time: '1 day ago', type: 'achievement' },
  ];

  // Mock unread messages
  const unreadMessages = [
    { teacher: 'Ms. Smith', subject: 'Mathematics', preview: 'Emma is doing great in class! She showed excellent...', time: '2 hours ago' },
    { teacher: 'Mr. Davis', subject: 'Reading', preview: 'Please encourage Noah to read 20 minutes daily...', time: '1 day ago' },
  ];
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const currentChild = children[selectedChild];
  const totalUnread = unreadMessages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
      {/* Top Navigation */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/parent/dashboard" className="flex items-center gap-3 group">
              <img src={logo} alt="TinyLearn" className="h-14 w-14 object-contain transition-transform group-hover:scale-110" />
              <div>
                <h1 className="text-2xl font-black text-gray-900">TinyLearn</h1>
                <p className="text-xs text-gray-600 font-semibold">Parent Portal</p>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/parent/dashboard"
                  className="px-4 py-2 bg-[#F4C21A] text-gray-900 rounded-lg font-semibold"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parent/progress"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  Student Progress
                </Link>
                <Link
                  to="/parent/messages"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors relative"
                >
                  Messages
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {parentUser.name.split(' ')[0]}!
          </h2>
          <p className="text-lg text-gray-600">
            Here's a quick overview of your children's progress
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex gap-4 mb-8">
          {children.map((child, index) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(index)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all shadow-md ${
                selectedChild === index
                  ? 'bg-[#F4C21A] text-gray-900 shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-3xl">{child.avatar}</span>
              <div className="text-left">
                <p className="font-bold">{child.name}</p>
                <p className="text-xs opacity-80">{child.grade}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Overall Progress</p>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-4xl font-black text-blue-600 mb-1">{currentChild.overallProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentChild.overallProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Active Lessons</p>
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-4xl font-black text-green-600">{currentChild.activeLessons}</p>
            <p className="text-xs text-gray-500 mt-1">Subjects in progress</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Pending Work</p>
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-4xl font-black text-orange-600">{currentChild.pendingAssignments}</p>
            <p className="text-xs text-gray-500 mt-1">Assignments due</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600">Average Score</p>
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-4xl font-black text-purple-600">{currentChild.averageScore}</p>
            <p className="text-xs text-gray-500 mt-1">Out of 100</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
              </div>
              <Link 
                to="/parent/progress"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'message' ? 'bg-blue-500' :
                      activity.type === 'achievement' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{activity.child}</p>
                      <p className="text-sm text-gray-700">{activity.activity}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unread Messages */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Unread Messages</h3>
                {totalUnread > 0 && (
                  <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {totalUnread}
                  </span>
                )}
              </div>
              <Link 
                to="/parent/messages"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="space-y-4">
                {unreadMessages.map((message, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-900">{message.teacher}</p>
                      <p className="text-xs text-gray-500">{message.time}</p>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mb-1">{message.subject}</p>
                    <p className="text-sm text-gray-700">{message.preview}</p>
                  </div>
                ))}
                {unreadMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No unread messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-[#F4C21A] to-[#FFD700] rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/parent/progress"
              className="flex items-center gap-4 bg-white/90 hover:bg-white p-5 rounded-xl transition-all shadow-md hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">View Detailed Progress</p>
                <p className="text-sm text-gray-600">See all lessons and assignments</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 ml-auto" />
            </Link>
            <Link
              to="/parent/messages"
              className="flex items-center gap-4 bg-white/90 hover:bg-white p-5 rounded-xl transition-all shadow-md hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Message Teachers</p>
                <p className="text-sm text-gray-600">Start a new conversation</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
