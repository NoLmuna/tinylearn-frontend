import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AcademicCapIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import PlayfulButton from '../../components/PlayfulButton';
import { useAuth } from '../../hooks/useAuth';

const roleConfig = {
  student: { 
    dashboardPath: '/student'
  },
  parent: { 
    dashboardPath: '/parent'
  },
  teacher: { 
    dashboardPath: '/teacher'
  },
  admin: { 
    dashboardPath: '/admin'
  },
};

export default function Login() {
  const { login, logout, user, getRoleDashboardPath } = useAuth();
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    rememberMe: false 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dashboardPath = roleConfig[user.role]?.dashboardPath || '/dashboard';
      navigate(dashboardPath);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check for saved credentials
    const savedEmail = localStorage.getItem('tinylearn_email');
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({
        email: form.email.trim(),
        password: form.password
      }, false); // Disable AuthContext toast

      if (result.success) {
        // Block admin users from logging in through regular login
        if (result.user.role === 'admin') {
          await logout(false); // Logout the admin user immediately (no toast)
          toast.error('Access denied. Administrators must use the secure admin login.');
          setTimeout(() => {
            navigate('/admin/login');
          }, 2000);
          return;
        }

        // Save email if remember me is checked
        if (form.rememberMe) {
          localStorage.setItem('tinylearn_email', form.email);
        } else {
          localStorage.removeItem('tinylearn_email');
        }

        toast.success(`Welcome back, ${result.user.firstName}!`);
        
        // Navigate to role-specific dashboard
        const dashboardPath = getRoleDashboardPath(result.user.role);
        navigate(dashboardPath);
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 via-yellow-50 to-sky-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <AcademicCapIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
            Welcome Back!
          </h2>
          <p className="text-base sm:text-lg text-gray-700">
            Sign in to your TinyLearn account
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl rounded-3xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border-2 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">
                  Contact admin for help
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <PlayfulButton
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </PlayfulButton>
            </div>
          </form>

          {/* Account Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need an account?
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All accounts are created by administrators. Please contact your school admin for access.
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="mt-6 text-center">
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Administrator?{' '}
                <Link
                  to="/admin/login"
                  className="font-medium text-red-600 hover:text-red-500 transition-colors"
                >
                  Secure Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}