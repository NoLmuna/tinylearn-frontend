import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Shield, AlertCircle } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Admin Login Page Component
 * Administrative portal authentication
 */
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      // API call to backend admin endpoint
      const response = await fetch('http://localhost:3000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store admin token with role identifier
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('userRole', 'admin');
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid admin credentials. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F4C21A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#F4C21A] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <img 
                  src={logo}
                  alt="Level Up Learning Center - TinyLearn" 
                  className="h-24 w-24 object-contain"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#F4C21A] rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-1">TinyLearn Admin</h1>
                <div className="flex items-center justify-center gap-2 text-[#F4C21A] text-sm font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Administrative Portal</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-gray-200">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your administrator credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent transition duration-200"
                  placeholder="admin@tinylearn.com"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C21A] focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Sign In as Admin
                  </span>
                )}
              </Button>
            </form>

            {/* Back to Main Login */}
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-[#F4C21A] transition-colors font-medium"
              >
                ← Back to Teacher/Student/Parent Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            This is a secure admin portal. All activities are logged.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
