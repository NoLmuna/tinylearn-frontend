import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Users, MessageCircle, LogOut, Search, Plus, Filter, Eye, Edit, Trash2, TrendingUp, Bell, Mail, Phone, Award, Target, Calendar, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';
import { useCreateStudent, useCreateParent, useAssignedStudents } from '../../hooks/teacherHooks';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Teacher Users Management Page
 * Manage students and parents with unique card-based design
 */
function TeacherUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUserType, setCreateUserType] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    grade: '',
    age: '',
    phoneNumber: '',
    relationship: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Hooks
  const createStudent = useCreateStudent();
  const createParent = useCreateParent();
  const { data: assignedStudentsData } = useAssignedStudents();

  const teacherUser = { name: 'Sarah Johnson', subject: 'Mathematics' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (createUserType === 'student') {
      if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 18)) {
        errors.age = 'Age must be between 1 and 18';
      }
    }

    if (createUserType === 'parent') {
      if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      if (createUserType === 'student') {
        if (formData.grade) submitData.grade = formData.grade;
        if (formData.age) submitData.age = parseInt(formData.age);
        
        await createStudent.mutateAsync(submitData);
        setSuccessMessage('Student created successfully!');
      } else {
        if (formData.phoneNumber) submitData.phoneNumber = formData.phoneNumber.trim();
        if (formData.relationship) submitData.relationship = formData.relationship.trim();
        
        await createParent.mutateAsync(submitData);
        setSuccessMessage('Parent created successfully!');
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        grade: '',
        age: '',
        phoneNumber: '',
        relationship: '',
      });
      setFormErrors({});

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['assigned-students'] });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Creation error:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Creation failed. Please try again.' });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      grade: '',
      age: '',
      phoneNumber: '',
      relationship: '',
    });
    setFormErrors({});
    setSuccessMessage('');
  };

  // Enhanced mock users data with more details
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', type: 'student', grade: '5th Grade', parent: 'Jane Doe', status: 'active', performance: 92, attendance: 95, lastActive: '2 hours ago', color: 'from-blue-400 to-cyan-500' },
    { id: 2, name: 'Emily Smith', email: 'emily.smith@example.com', type: 'student', grade: '5th Grade', parent: 'Robert Smith', status: 'active', performance: 88, attendance: 98, lastActive: '1 hour ago', color: 'from-purple-400 to-pink-500' },
    { id: 3, name: 'Jane Doe', email: 'jane.doe@example.com', type: 'parent', children: 'John Doe', phone: '+1234567890', status: 'active', engagement: 'High', lastContact: 'Yesterday', color: 'from-green-400 to-emerald-500' },
    { id: 4, name: 'Michael Brown', email: 'michael.brown@example.com', type: 'student', grade: '6th Grade', parent: 'Sarah Brown', status: 'active', performance: 85, attendance: 92, lastActive: '5 hours ago', color: 'from-orange-400 to-red-500' },
    { id: 5, name: 'Robert Smith', email: 'robert.smith@example.com', type: 'parent', children: 'Emily Smith', phone: '+1234567891', status: 'active', engagement: 'Very High', lastContact: 'Today', color: 'from-teal-400 to-cyan-500' },
    { id: 6, name: 'Lisa Wilson', email: 'lisa.wilson@example.com', type: 'student', grade: '5th Grade', parent: 'David Wilson', status: 'active', performance: 95, attendance: 100, lastActive: '30 mins ago', color: 'from-indigo-400 to-purple-500' },
    { id: 7, name: 'Sarah Brown', email: 'sarah.brown@example.com', type: 'parent', children: 'Michael Brown', phone: '+1234567892', status: 'active', engagement: 'Medium', lastContact: '2 days ago', color: 'from-pink-400 to-rose-500' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const studentCount = users.filter(u => u.type === 'student').length;
  const parentCount = users.filter(u => u.type === 'parent').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/teacher/dashboard" className="flex items-center gap-3">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900">Teacher Portal</h1>
                  <p className="text-xs text-indigo-600 font-semibold">{teacherUser.subject}</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/teacher/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Learning Materials
                </Link>
                <Link
                  to="/teacher/messages"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {teacherUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{teacherUser.name}</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">User Management</h2>
          <p className="text-gray-600 text-lg">Manage student and parent accounts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                  <p className="text-4xl font-black text-gray-900">{studentCount}</p>
                  <p className="text-xs text-gray-500 mt-2">↑ 12% from last month</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Linked Parents</p>
                  <p className="text-4xl font-black text-gray-900">{parentCount}</p>
                  <p className="text-xs text-gray-500 mt-2">79% engagement rate</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg. Performance</p>
                  <p className="text-4xl font-black text-gray-900">89%</p>
                  <p className="text-xs text-gray-500 mt-2">↑ 5% improvement</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="student">Students</option>
                    <option value="parent">Parents</option>
                  </select>
                </div>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${user.type === 'student' ? 'from-blue-400 to-blue-600' : 'from-green-400 to-green-600'} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{user.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.type === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      <User className="w-3 h-3" />
                      {user.type === 'student' ? 'Student' : 'Parent'}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.type === 'student' ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>{user.grade}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Parent: {user.parent}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Child: {user.children}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Performance Metrics for Students */}
                {user.type === 'student' && (
                  <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Performance</span>
                        <span className="text-sm font-bold text-indigo-600">{user.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${user.performance}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Attendance</span>
                        <span className="text-sm font-bold text-blue-600">{user.attendance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${user.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engagement for Parents */}
                {user.type === 'parent' && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Engagement</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.engagement === 'Very High' ? 'bg-green-100 text-green-700' :
                        user.engagement === 'High' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.engagement}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Last contact: {user.lastContact}</span>
                    </div>
                  </div>
                )}

                {/* Last Active */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {user.type === 'student' ? `Active ${user.lastActive}` : `Contacted ${user.lastContact}`}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="border-none shadow-lg">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-black">Add New User</CardTitle>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message */}
                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-800">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {formErrors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-red-800">{formErrors.submit}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">User Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCreateUserType('student')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        createUserType === 'student'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900">Student</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateUserType('parent')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        createUserType === 'parent'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900">Parent</p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.firstName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="John"
                    />
                    {formErrors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.lastName ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Doe"
                    />
                    {formErrors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="user@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Minimum 6 characters"
                  />
                  {formErrors.password && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
                  )}
                </div>

                {createUserType === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Grade</label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select Grade</option>
                        <option value="5th Grade">5th Grade</option>
                        <option value="6th Grade">6th Grade</option>
                        <option value="7th Grade">7th Grade</option>
                        <option value="8th Grade">8th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="1"
                        max="18"
                        className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.age ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="1-18"
                      />
                      {formErrors.age && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.age}</p>
                      )}
                    </div>
                  </>
                )}

                {createUserType === 'parent' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.phoneNumber ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="+1234567890"
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.phoneNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Relationship</label>
                      <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select Relationship</option>
                        <option value="mother">Mother</option>
                        <option value="father">Father</option>
                        <option value="guardian">Guardian</option>
                        <option value="grandmother">Grandmother</option>
                        <option value="grandfather">Grandfather</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1"
                    disabled={createStudent.isPending || createParent.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                    disabled={createStudent.isPending || createParent.isPending}
                  >
                    {createStudent.isPending || createParent.isPending ? 'Creating...' : 'Add User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TeacherUsers;
