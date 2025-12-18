import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Users, BookOpen, AlertCircle } from 'lucide-react';
import logo from '../assets/levelup-logo.png';

/**
 * Main Login Page Component
 * Unified login for Students, Parents, and Teachers
 * Role is automatically detected from backend after authentication
 */
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const loginMutation = useLogin();

  // Informational role display only
  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      description: 'Access your courses and learning materials'
    },
    {
      id: 'parent',
      title: 'Parent',
      icon: Users,
      color: 'from-green-500 to-green-600',
      description: 'Monitor your child\'s progress'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      description: 'Manage classes and student progress'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginMutation.mutateAsync(formData);

      const role = data?.role ?? localStorage.getItem('userRole') ?? 'student';
      navigate(`/${role}/dashboard`);
    } catch (err) {
      // Zod validation error
      if (err?.name === 'ZodError') {
        const first = err.errors?.[0];
        setError(first?.message ?? 'Please check your input and try again.');
        return;
      }

      // Axios / API error
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Unable to sign in. Please check your email and password.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9E6] via-[#F9F9F9] to-[#FFE5B4] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      {/* Playful background elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce">🎓</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>📚</div>
      <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>✏️</div>
      <div className="absolute top-60 right-10 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }}>🌟</div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <img 
                src={logo}
                alt="Level Up Learning Center - TinyLearn" 
                className="h-24 w-24 object-contain"
              />
              <h1 className="text-4xl font-black text-black">Welcome to TinyLearn! 🎉</h1>
            </div>
          </Link>
          <p className="text-xl text-gray-700 font-medium">Sign in to your account</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-[#F4C21A]">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Informational Role Display */}
            <div className="mb-8">
              <p className="block text-sm font-bold text-gray-700 mb-4 text-center">
                For Students, Parents & Teachers
              </p>
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.id}
                      className="p-4 rounded-2xl border-2 border-gray-200 bg-white"
                    >
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center bg-gradient-to-br ${role.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 text-center">{role.title}</p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Your account type will be automatically detected
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent transition duration-200 text-base"
                  placeholder={`Enter your email`}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent transition duration-200 text-base"
                  placeholder="Enter your password"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-sm text-[#F4C21A] hover:underline font-semibold">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                size="lg"
                className="w-full mt-6 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg py-6 rounded-xl"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🎓
                    Sign In to Your Dashboard
                  </span>
                )}
              </Button>
            </form>

            {/* Admin Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Link 
                to="/admin/login" 
                className="text-sm text-gray-600 hover:text-[#F4C21A] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>🔐</span>
                Administrator Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-[#F4C21A] transition-colors font-medium text-lg"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
