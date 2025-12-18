import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Shield, 
  Users, 
  LogOut,
  LayoutDashboard,
  BarChart3,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download
} from 'lucide-react';
import logo from '../../assets/levelup-logo.png';
import AdminCreateTeacher from '../../components/admin/adminCreateTeacher.jsx';
import { useAdminTeachers } from '../../hooks/adminHooks.jsx';

/**
 * Teachers Management Page
 * Comprehensive teacher management interface
 */
function Teachers() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('teachers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const adminUser = { name: 'Administrator', email: 'admin@tinylearn.com' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // Fetch teachers from backend
  const {
    data: teachersResponse,
    isLoading: teachersLoading,
    isError: teachersError,
  } = useAdminTeachers();

  const apiTeachers = Array.isArray(teachersResponse?.data) ? teachersResponse.data : [];

  const teachers = apiTeachers.map((t) => ({
    id: t.id || t._id,
    name: `${t.firstName} ${t.lastName}`,
    email: t.email,
    subject: t.subjectSpecialty || 'N/A',
    classes: 0,
    students: 0,
    joinDate: t.createdAt ? new Date(t.createdAt).toISOString().slice(0, 10) : '',
    status: t.accountStatus,
  }));

  const subjects = ['All', 'Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education', 'Music'];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || teacher.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src={logo} alt="TinyLearn" className="h-10 w-10 object-contain" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    TinyLearn
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md">
                      ADMIN
                    </span>
                  </h1>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setActiveNav('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/teachers"
                  onClick={() => setActiveNav('teachers')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'teachers'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Teachers
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setActiveNav('reports')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeNav === 'reports'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  System & Reports
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Teacher Management</h2>
          <p className="text-lg text-gray-600">Manage and monitor all teacher accounts</p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-black text-gray-900">{teachers.length}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">+2 this month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <LayoutDashboard className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-gray-900">{teachers.reduce((acc, t) => acc + t.classes, 0)}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Across all teachers</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-gray-900">{teachers.reduce((acc, t) => acc + t.students, 0)}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Learning actively</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-gray-900">{subjects.length - 1}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">Different subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Teachers Table */}
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-black text-gray-900">All Teachers</CardTitle>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Teacher
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject.toLowerCase()}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Teacher</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Subject</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Classes</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Students</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Join Date</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{teacher.name}</p>
                            <p className="text-xs text-gray-500">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          {teacher.subject}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">{teacher.classes}</td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">{teacher.students}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{teacher.joinDate}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-indigo-50 hover:text-indigo-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">No teachers found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Teacher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AdminCreateTeacher onCancel={() => setShowCreateModal(false)} />
        </div>
      )}
    </div>
  );
}

export default Teachers;
