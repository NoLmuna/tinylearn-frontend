import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/levelup-logo.png';

/**
 * Student Dashboard Component
 * Main dashboard for students after login
 */
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Student User', email: 'student@example.com' }); // Mock user
  const [loading, setLoading] = useState(false); // Set to false to skip loading

  // Authentication check removed for front-end preview
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const userData = localStorage.getItem('user');

  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }

  //   if (userData) {
  //     setUser(JSON.parse(userData));
  //   }
  //   setLoading(false);
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={logo}
                alt="Level Up Learning Center - TinyLearn" 
                className="h-16 w-16 object-contain"
              />
              <span className="text-2xl font-black text-black">TinyLearn</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-black font-semibold">
                Welcome, <span className="font-bold">{user?.name || user?.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-black mb-4">
            Welcome Back, {user?.name || 'Learner'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">My Courses</h3>
              <div className="w-10 h-10 bg-[#F4C21A] bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F4C21A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#F4C21A] mb-2">8</div>
            <p className="text-sm text-gray-500">Active courses</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">24</div>
            <p className="text-sm text-gray-500">Badges earned</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Study Time</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">12h</div>
            <p className="text-sm text-gray-500">This week</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
            <p className="text-sm text-gray-500">Overall completion</p>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
          <div className="space-y-4">
            {[
              { name: 'React Fundamentals', progress: 75, color: 'blue' },
              { name: 'JavaScript Advanced', progress: 45, color: 'green' },
              { name: 'TailwindCSS Mastery', progress: 90, color: 'purple' },
            ].map((course, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <span className="text-sm text-gray-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${course.color}-600 h-2 rounded-full transition-all`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
