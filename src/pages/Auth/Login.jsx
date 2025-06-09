import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import PlayfulButton from '../../components/PlayfulButton';
import { useAuth } from '../../contexts/AuthContext';

// Mock user data for testing
const mockUsers = {
  'student@test.com': { password: 'password123', role: 'student', code: 'STU123', name: 'Student Demo' },
  'parent@test.com': { password: 'password123', role: 'parent', code: 'PAR123', name: 'Parent Demo' },
  'tutor@test.com': { password: 'password123', role: 'tutor', code: 'TUT123', name: 'Tutor Demo' },
};

const roleFields = {
  student: { 
    label: 'Class Code',
    name: 'classCode', 
    placeholder: 'Enter your class code',
    icon: AcademicCapIcon,
    btnColor: 'bg-blue-500 border-blue-500',
    color: 'blue',
    dashboardPath: '/student'
  },
  parent: { 
    label: 'Child Code',
    name: 'childCode', 
    placeholder: 'Enter your child code',
    icon: UserGroupIcon,
    btnColor: 'bg-green-500 border-green-500',
    color: 'green',
    dashboardPath: '/parent'
  },
  tutor: { 
    label: 'Staff Code',
    name: 'staffCode', 
    placeholder: 'Enter your staff code',
    icon: BookOpenIcon,
    btnColor: 'bg-purple-500 border-purple-500',
    color: 'purple',
    dashboardPath: '/tutor'
  },
};

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '', code: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved credentials
    const savedEmail = localStorage.getItem('tinylearn_email');
    const savedRole = localStorage.getItem('tinylearn_role');
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
      if (savedRole) setRole(savedRole);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }
    if (!form.code) {
      newErrors.code = `${roleFields[role].label} is required`;
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
      const user = mockUsers[form.email];
      if (!user || user.password !== form.password || user.role !== role || user.code !== form.code) {
        throw new Error('Invalid credentials');
      }

      if (form.rememberMe) {
        localStorage.setItem('tinylearn_email', form.email);
        localStorage.setItem('tinylearn_role', role);
      }

      login({
        email: form.email,
        role: role,
        name: user.name
      });

      toast.success('Welcome back!');
      navigate(roleFields[role].dashboardPath);
    } catch (error) {
      toast.error(error.message === 'Invalid credentials' 
        ? 'Invalid email, password, or code' 
        : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 via-yellow-50 to-sky-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">Welcome Back!</h2>
          <p className="text-base sm:text-lg text-gray-700">Sign in to your TinyLearn account</p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl rounded-3xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]">
          <div className="flex justify-center gap-3 mb-8">            {Object.entries(roleFields).map(([r, field]) => {
              const Icon = field.icon;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold border-2 transition-all duration-300 shadow-md ${
                    role === r 
                      ? field.btnColor + ' text-white'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                  aria-pressed={role === r}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${role === r ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              );
            })}
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                value={form.email}
                onChange={handleChange}
                className={`block w-full rounded-lg px-4 py-3 shadow-sm focus:ring-2 sm:text-sm font-medium text-gray-800 transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" id="email-error">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                value={form.password}
                onChange={handleChange}
                className={`block w-full rounded-lg px-4 py-3 shadow-sm focus:ring-2 sm:text-sm font-medium text-gray-800 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" id="password-error">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-1">{roleFields[role].label}</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                aria-invalid={!!errors.code}
                aria-describedby={errors.code ? 'code-error' : undefined}
                placeholder={roleFields[role].placeholder}
                value={form.code}
                onChange={handleChange}
                className={`block w-full rounded-lg px-4 py-3 shadow-sm focus:ring-2 sm:text-sm font-medium text-gray-800 transition-all duration-200 ${
                  errors.code 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600" id="code-error">{errors.code}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <PlayfulButton 
              type="submit" 
              className={`w-full text-xl py-4 ${isLoading ? 'opacity-75 cursor-wait' : ''}`} 
              color={roleFields[role].color}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </PlayfulButton>

            <div className="bg-blue-50 rounded-xl p-4 mt-6 text-sm text-blue-700">
              <p>Test accounts:</p>
              <ul className="list-disc list-inside mt-1">
                <li>student@test.com / password123 (Code: STU123)</li>
                <li>parent@test.com / password123 (Code: PAR123)</li>
                <li>tutor@test.com / password123 (Code: TUT123)</li>
              </ul>
            </div>
          </form>
          <div className="mt-8 text-center text-base">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-semibold transition-colors duration-200">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}