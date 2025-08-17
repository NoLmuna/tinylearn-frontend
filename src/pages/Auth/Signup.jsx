import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { UserGroupIcon, BookOpenIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import PlayfulButton from '../../components/PlayfulButton';
import { useAuth } from '../../hooks/useAuth';

const roles = {
  parent: {
    label: 'Parent',
    icon: UserGroupIcon,
    color: 'green',
    description: 'Create an account to track your child\'s learning progress and communicate with teachers.',
    benefits: ['Track your child\'s progress', 'Communicate with teachers', 'Access learning reports', 'Support homework activities']
  },
  teacher: {
    label: 'Teacher',
    icon: BookOpenIcon,
    color: 'purple',
    description: 'Join as an educator to create lessons, manage students, and track learning outcomes.',
    benefits: ['Create interactive lessons', 'Manage student accounts', 'Track student progress', 'Communicate with parents']
  }
};

export default function Signup() {
  const { register, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'parent');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const dashboardPath = user.role === 'student' ? '/student' : '/dashboard';
      navigate(dashboardPath);
    }
  }, [user, navigate]);

  // Validate role from URL params
  useEffect(() => {
    const roleFromUrl = searchParams.get('role');
    if (roleFromUrl && roles[roleFromUrl]) {
      setSelectedRole(roleFromUrl);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
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
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
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

    // Validate role
    if (!roles[selectedRole]) {
      toast.error('Please select a valid role');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: selectedRole
      });

      if (result.success) {
        toast.success(`Welcome to TinyLearn, ${result.user.firstName}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = roles[selectedRole];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50 via-yellow-50 to-sky-50">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className={`p-4 ${
              currentRole.color === 'green' 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-purple-400 to-violet-500'
            } rounded-full shadow-xl`}>
              <currentRole.icon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
            Join as a {currentRole.label}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            {currentRole.description}
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-xl rounded-3xl border border-pink-100">
          
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Account Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(roles).map(([key, role]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedRole(key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === key
                      ? role.color === 'green'
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <role.icon className={`h-8 w-8 ${
                      selectedRole === key
                        ? role.color === 'green' ? 'text-green-600' : 'text-purple-600'
                        : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <h3 className={`font-bold ${
                        selectedRole === key
                          ? role.color === 'green' ? 'text-green-900' : 'text-purple-900'
                          : 'text-gray-700'
                      }`}>
                        {role.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {key === 'parent' ? 'Track child progress' : 'Manage students & lessons'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

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

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-4 py-3 pr-12 border-2 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-4 py-3 pr-12 border-2 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <PlayfulButton
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  currentRole.color === 'green'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800'
                    : 'bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800'
                } text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  currentRole.color === 'green' ? 'focus:ring-green-500' : 'focus:ring-purple-500'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <currentRole.icon className="h-5 w-5 mr-2 inline" />
                    Create {currentRole.label} Account
                  </>
                )}
              </PlayfulButton>
            </div>
          </form>

          {/* Benefits Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3">
              As a {currentRole.label}, you'll get:
            </h3>
            <ul className="space-y-2">
              {currentRole.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <div className={`w-2 h-2 ${
                    currentRole.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  } rounded-full mr-3`}></div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Student Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 text-center">
              <strong>For Students:</strong> Accounts are provided by your teacher or administrator. 
              Contact your learning center for login credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
