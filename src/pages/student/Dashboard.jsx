import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, FileCheck, Award, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Student Dashboard Component
 * Simple, child-friendly dashboard focused on Lessons and Assignments
 */
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Alex', email: 'student@example.com' });
  const [loading, setLoading] = useState(false);

  // Mock data for lessons
  const lessons = [
    { id: 1, title: 'Fun with Numbers', teacher: 'Ms. Smith', progress: 75, icon: '🔢', color: 'bg-blue-500', lessons: 8, completed: 6 },
    { id: 2, title: 'Reading Adventures', teacher: 'Mr. Johnson', progress: 60, icon: '📚', color: 'bg-green-500', lessons: 10, completed: 6 },
    { id: 3, title: 'Science Explorers', teacher: 'Ms. Davis', progress: 40, icon: '🔬', color: 'bg-purple-500', lessons: 12, completed: 5 },
    { id: 4, title: 'Art & Creativity', teacher: 'Ms. Brown', progress: 90, icon: '🎨', color: 'bg-pink-500', lessons: 6, completed: 5 },
  ];

  // Mock data for assignments
  const assignments = [
    { id: 1, title: 'Math Practice Sheet', subject: 'Fun with Numbers', dueDate: 'Tomorrow', status: 'pending', icon: '🔢', urgent: true },
    { id: 2, title: 'Read Chapter 5', subject: 'Reading Adventures', dueDate: 'Friday', status: 'pending', icon: '📚', urgent: false },
    { id: 3, title: 'Draw Your Family', subject: 'Art & Creativity', dueDate: 'Next Week', status: 'completed', icon: '🎨', urgent: false },
    { id: 4, title: 'Science Quiz', subject: 'Science Explorers', dueDate: 'Monday', status: 'pending', icon: '🔬', urgent: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600 font-semibold">Loading your dashboard...</div>
      </div>
    );
  }

  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#F4C21A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={logo}
                alt="TinyLearn" 
                className="h-14 w-14 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-black text-gray-900">TinyLearn</span>
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Welcome back!</p>
                <p className="text-lg font-bold text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 active:bg-gray-700 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#F4C21A] to-[#FFD700] rounded-3xl shadow-2xl p-8 mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
            Hi {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-800 font-semibold">
            Let's learn something awesome today!
          </p>
          {pendingAssignments > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-md">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-gray-900">
                You have {pendingAssignments} assignment{pendingAssignments > 1 ? 's' : ''} to complete
              </span>
            </div>
          )}
        </div>

        {/* My Lessons Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">My Lessons</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 overflow-hidden border-2 border-gray-100 hover:border-[#F4C21A] cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 ${lesson.color} rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                      {lesson.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 font-medium">Teacher: {lesson.teacher}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-700">Your Progress</span>
                      <span className="font-bold text-gray-900">{lesson.completed} of {lesson.lessons} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${lesson.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="mt-5 w-full bg-[#F4C21A] hover:bg-[#d4a617] active:bg-[#c09615] text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-lg">
                    Continue Learning →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Assignments Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">My Assignments</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 border-2 ${
                  assignment.status === 'completed' 
                    ? 'border-green-300 bg-green-50/50' 
                    : assignment.urgent 
                    ? 'border-orange-300 bg-orange-50/50' 
                    : 'border-gray-100 hover:border-[#F4C21A]'
                } cursor-pointer overflow-hidden`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{assignment.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{assignment.subject}</p>
                      </div>
                    </div>
                    {assignment.status === 'completed' && (
                      <div className="bg-green-500 rounded-full p-2 shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className={`text-sm font-semibold ${
                      assignment.urgent ? 'text-orange-700' : 'text-gray-700'
                    }`}>
                      Due: {assignment.dueDate}
                    </span>
                    {assignment.urgent && (
                      <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        URGENT
                      </span>
                    )}
                  </div>

                  {assignment.status === 'completed' ? (
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md text-lg">
                      View Submission ✓
                    </button>
                  ) : (
                    <button className="w-full bg-[#F4C21A] hover:bg-[#d4a617] active:bg-[#c09615] text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-lg">
                      Start Assignment →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement Section */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 border-4 border-[#F4C21A] text-center">
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16 text-[#F4C21A]" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Keep up the great work!</h3>
          <p className="text-lg text-gray-700 font-medium">
            You're doing amazing! Every lesson completed is a step closer to becoming a super learner! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
