import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, FileCheck, Award, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';
import { useStudentLessons } from '../../hooks/studentHooks';

/**
 * Student Dashboard Component
 * Simple, child-friendly dashboard focused on Lessons and Assignments
 */
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Alex', email: 'student@example.com' });
  
  // Fetch lessons from API
  const { data: lessonsData, isLoading: isLoadingLessons } = useStudentLessons();
  const rawLessons = lessonsData?.data?.lessons || [];

  // Transform lessons for display
  const getCategoryIcon = (category) => {
    const icons = {
      math: '🔢',
      reading: '📚',
      science: '🔬',
      art: '🎨',
      music: '🎵',
      physical: '⚽',
      social: '🌍',
    };
    return icons[category] || '📖';
  };

  const getCategoryColor = (category) => {
    const colors = {
      math: 'bg-blue-500',
      reading: 'bg-green-500',
      science: 'bg-purple-500',
      art: 'bg-pink-500',
      music: 'bg-yellow-500',
      physical: 'bg-orange-500',
      social: 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const lessons = rawLessons.map((lesson) => {
    const chapters = lesson.content || [];
    const completedChapters = chapters.filter(ch => ch.isSeen === true).length;
    const totalChapters = chapters.length;
    const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    
    const teacherName = lesson.teacherId && typeof lesson.teacherId === 'object'
      ? `${lesson.teacherId.firstName} ${lesson.teacherId.lastName}`
      : 'Teacher';

    return {
      id: lesson._id || lesson.id,
      title: lesson.title,
      teacher: teacherName,
      progress: progress,
      icon: getCategoryIcon(lesson.category),
      color: getCategoryColor(lesson.category),
      lessons: totalChapters,
      completed: completedChapters,
      category: lesson.category,
      difficulty: lesson.difficulty,
      ageGroup: lesson.ageGroup,
      _raw: lesson
    };
  });

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

  if (isLoadingLessons) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#F4C21A] rounded-2xl flex items-center justify-center animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="text-2xl text-gray-600 font-semibold">Loading your dashboard...</div>
          <p className="text-gray-500 mt-2">Fetching your lessons...</p>
        </div>
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

          {lessons.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No lessons available</h3>
              <p className="text-gray-600">Your teacher hasn't assigned any lessons yet. Check back soon!</p>
            </div>
          ) : (
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
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full capitalize">
                            {lesson.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full capitalize">
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">Your Progress</span>
                        <span className="font-bold text-gray-900">{lesson.completed} of {lesson.lessons} chapters</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${lesson.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${lesson.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        // Navigate to lesson - first chapter will be marked as seen automatically
                        navigate(`/student/lessons/${lesson.id}`);
                      }}
                      className="mt-5 w-full bg-[#F4C21A] hover:bg-[#d4a617] active:bg-[#c09615] text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-lg"
                    >
                      {lesson.progress > 0 ? 'Continue Learning →' : 'Start Learning →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
