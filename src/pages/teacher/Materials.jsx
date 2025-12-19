import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Users, MessageCircle, LogOut, Upload, Plus, FileText, Video, Image, File, TrendingUp, Bell, Eye, Edit, Trash2, Download } from 'lucide-react';
import logo from '../../assets/levelup-logo.png';

/**
 * Teacher Learning Materials Page
 * Upload modules/lessons and create assignments
 */
function TeacherMaterials() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('modules');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);

  const teacherUser = { name: 'Sarah Johnson', subject: 'Mathematics' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Mock materials data
  const modules = [
    { id: 1, title: 'Introduction to Algebra', type: 'pdf', size: '2.5 MB', uploaded: '2024-01-15', views: 124, downloads: 45 },
    { id: 2, title: 'Quadratic Equations Explained', type: 'video', size: '45 MB', uploaded: '2024-01-18', views: 98, downloads: 32 },
    { id: 3, title: 'Geometry Fundamentals', type: 'pdf', size: '3.2 MB', uploaded: '2024-01-20', views: 87, downloads: 28 },
    { id: 4, title: 'Trigonometry Basics', type: 'pdf', size: '2.8 MB', uploaded: '2024-01-22', views: 65, downloads: 21 },
    { id: 5, title: 'Statistics and Probability', type: 'pdf', size: '4.1 MB', uploaded: '2024-01-25', views: 54, downloads: 18 }
  ];

  const assignments = [
    { id: 1, title: 'Algebra Practice Set 1', module: 'Introduction to Algebra', dueDate: '2024-02-10', submissions: 45, totalStudents: 124, status: 'active' },
    { id: 2, title: 'Quadratic Equations Quiz', module: 'Quadratic Equations Explained', dueDate: '2024-02-12', submissions: 32, totalStudents: 124, status: 'active' },
    { id: 3, title: 'Geometry Problem Set', module: 'Geometry Fundamentals', dueDate: '2024-02-15', submissions: 28, totalStudents: 124, status: 'active' },
    { id: 4, title: 'Trigonometry Assignment', module: 'Trigonometry Basics', dueDate: '2024-02-18', submissions: 0, totalStudents: 124, status: 'draft' }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-indigo-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-blue-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
                <Link
                  to="/teacher/materials"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-600 transition-all"
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
          <h2 className="text-3xl font-black text-gray-900 mb-2">Learning Materials</h2>
          <p className="text-gray-600 text-lg">Upload modules and create assignments</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Modules</p>
                  <p className="text-4xl font-black text-gray-900">{modules.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Assignments</p>
                  <p className="text-4xl font-black text-gray-900">{assignments.filter(a => a.status === 'active').length}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                  <p className="text-4xl font-black text-gray-900">{modules.reduce((acc, m) => acc + m.views, 0)}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab('modules')}
            variant={activeTab === 'modules' ? 'default' : 'outline'}
            className={activeTab === 'modules' ? 'bg-gradient-to-r from-indigo-500 to-blue-600' : ''}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Modules
          </Button>
          <Button
            onClick={() => setActiveTab('assignments')}
            variant={activeTab === 'assignments' ? 'default' : 'outline'}
            className={activeTab === 'assignments' ? 'bg-gradient-to-r from-indigo-500 to-blue-600' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            Assignments
          </Button>
        </div>

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl font-black">Learning Modules</CardTitle>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Module
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border-2 border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 rounded-xl bg-gray-50">
                          {getFileIcon(module.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{module.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{module.size}</span>
                            <span>•</span>
                            <span>Uploaded {module.uploaded}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {module.views} views
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {module.downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl font-black">Assignments</CardTitle>
                <Button
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Title</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Linked Module</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Due Date</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Submissions</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                      <th className="text-right py-4 px-4 text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-900">{assignment.title}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{assignment.module}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{assignment.dueDate}</td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">{assignment.submissions}</span>
                            <span className="text-gray-600"> / {assignment.totalStudents}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            assignment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {assignment.status === 'active' ? 'Active' : 'Draft'}
                          </span>
                        </td>
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Module Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-2xl font-black">Upload Learning Module</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Module Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Brief description of the module..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, Video, or Image files (Max 100MB)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Module
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-2xl font-black">Create Assignment</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Assignment Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Algebra Practice Set 1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Link to Module</label>
                <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select a module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>{module.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Assignment instructions for students..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Points</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCreateAssignmentModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TeacherMaterials;
